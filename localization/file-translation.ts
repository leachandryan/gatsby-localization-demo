#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv';

interface TranslationTracker {
  lastRun: string | null;
}

interface TranslationResponse {
  data: {
    translations: Array<{
      translatedText: string;
    }>;
  };
  error?: {
    message: string;
  };
}

interface TranslationResult {
  filesTranslated: number;
  status: 'translated' | 'up-to-date';
}

type TranslatableValue = string | Array<any> | Record<string, any> | null | undefined;

export class FileTranslationService {
  private sourceLanguage: string;
  private targetLanguages: string[];
  private googleApiKey: string;
  private trackerPath: string;
  private baseDir: string;

  constructor() {
    dotenv.config();
    this.sourceLanguage = process.env.SOURCE_LANGUAGE || 'en';
    this.targetLanguages = (process.env.TARGET_LANGUAGES || '').split(',')
      .map(lang => lang.trim())
      .filter(Boolean);
    this.googleApiKey = process.env.GOOGLE_API_KEY || '';
    this.baseDir = 'localization/language-files';
    this.trackerPath = path.join(process.cwd(), this.baseDir, 'translation-tracker.json');
    
    if (!this.googleApiKey) {
      throw new Error('GOOGLE_API_KEY environment variable is required');
    }

    if (!this.targetLanguages.length) {
      throw new Error('TARGET_LANGUAGES environment variable must specify at least one language');
    }

    this.initializeDirectories();
    this.initializeTracker();
  }

  private initializeTracker(): void {
    const localesDir = path.dirname(this.trackerPath);
    if (!fs.existsSync(localesDir)) {
      fs.mkdirSync(localesDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.trackerPath)) {
      this.writeTrackerFile({ lastRun: null });
    }
  }

  private readTrackerFile(): TranslationTracker {
    try {
      return JSON.parse(fs.readFileSync(this.trackerPath, 'utf8'));
    } catch (error) {
      console.error('Error reading tracker file:', error);
      return { lastRun: null };
    }
  }

  private writeTrackerFile(data: TranslationTracker): boolean {
    try {
      fs.writeFileSync(this.trackerPath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing tracker file:', error);
      return false;
    }
  }

  private initializeDirectories(): void {
    const localesDir = path.join(process.cwd(), this.baseDir);
    
    if (!fs.existsSync(localesDir)) {
      console.log('Creating directory:', localesDir);
      fs.mkdirSync(localesDir, { recursive: true });
    }

    [this.sourceLanguage, ...this.targetLanguages].forEach(lang => {
      const langDir = path.join(localesDir, lang);
      if (!fs.existsSync(langDir)) {
        console.log(`Creating language directory: ${lang}`);
        fs.mkdirSync(langDir, { recursive: true });
      }
    });
  }

  private getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = this.getAllFiles(fullPath, arrayOfFiles);
      } else if (file.endsWith('.json') && file !== 'translation-tracker.json') {
        arrayOfFiles.push(fullPath);
      }
    });

    return arrayOfFiles;
  }

  private getModifiedFiles(lastRunDate: Date): string[] {
    const sourceDir = path.join(this.baseDir, this.sourceLanguage);
    const files = this.getAllFiles(sourceDir);
    
    return files.filter(file => {
      const stats = fs.statSync(file);
      return new Date(stats.mtime) > lastRunDate;
    });
  }

  private readJsonFile(filePath: string): Record<string, any> | null {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return null;
    }
  }

  private writeJsonFile(filePath: string, content: Record<string, any>): boolean {
    try {
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing file ${filePath}:`, error);
      return false;
    }
  }

  private async translateText(text: string, targetLang: string, retryCount = 3): Promise<TranslationResponse> {
    if (!text || typeof text !== 'string') return { data: { translations: [{ translatedText: text }] } };

    const requestData = JSON.stringify({
      q: text,
      source: this.sourceLanguage,
      target: targetLang,
      format: 'text'
    });

    const makeRequest = (): Promise<TranslationResponse> => new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'translation.googleapis.com',
        path: `/language/translate/v2?key=${this.googleApiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestData)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data) as TranslationResponse;
            if (parsedData.error) {
              reject(new Error(parsedData.error.message));
              return;
            }
            resolve(parsedData);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.write(requestData);
      req.end();
    });

    for (let i = 0; i < retryCount; i++) {
      try {
        return await makeRequest();
      } catch (error) {
        if (i === retryCount - 1) throw error;
        console.log(`Translation attempt ${i + 1} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }

    throw new Error('Translation failed after all retries');
  }

  private makeUrlFriendly(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async translateValue(value: TranslatableValue, targetLang: string, isSlug = false): Promise<TranslatableValue> {
    if (value == null) return value;

    if (Array.isArray(value)) {
      return Promise.all(value.map(item => this.translateValue(item, targetLang)));
    }

    if (typeof value === 'string') {
      if (value.match(/^\d{4}-\d{2}-\d{2}/) || 
          value.match(/^[0-9a-f]{24}$/) ||     
          value.match(/^\d+$/) ||              
          value.includes('@') ||               
          value.startsWith('http')) {          
        return value;
      }

      try {
        const response = await this.translateText(value, targetLang);
        const translatedText = response.data.translations[0].translatedText;
        return isSlug ? this.makeUrlFriendly(translatedText) : translatedText;
      } catch (error) {
        console.error(`Translation failed for "${value}":`, error);
        return value;
      }
    }

    if (typeof value === 'object') {
      const translated: Record<string, any> = {};
      for (const [key, val] of Object.entries(value)) {
        const isKeySlug = key === 'slug';
        translated[key] = await this.translateValue(val, targetLang, isKeySlug);
      }
      return translated;
    }

    return value;
  }

  private async translateFile(sourcePath: string, targetLang: string): Promise<string | null> {
    const relativeSourcePath = path.relative(path.join(this.baseDir, this.sourceLanguage), sourcePath);
    console.log(`Translating file to ${targetLang}: ${relativeSourcePath}`);
    
    const content = this.readJsonFile(sourcePath);
    if (!content) {
      return null;
    }

    try {
      const targetDir = path.join(this.baseDir, targetLang, path.dirname(relativeSourcePath));
      const targetPath = path.join(targetDir, path.basename(sourcePath));
      const translatedContent = await this.translateValue(content, targetLang);
      
      if (this.writeJsonFile(targetPath, translatedContent as Record<string, any>)) {
        console.log(`Successfully translated to: ${targetPath}`);
        return targetPath;
      }
    } catch (error) {
      console.error(`Translation failed for ${sourcePath}:`, error);
    }
    return null;
  }

  async translateAllFiles(): Promise<TranslationResult> {
    console.log('\n=== Starting File Translation Service ===');
    
    const tracker = this.readTrackerFile();
    const lastRunDate = tracker.lastRun ? new Date(tracker.lastRun) : new Date(0);
    const modifiedFiles = this.getModifiedFiles(lastRunDate);
    
    if (modifiedFiles.length === 0) {
      console.log('\n✓ All files are up to date! Last translation run:', lastRunDate.toISOString());
      console.log('=== File Translation Service End ===\n');
      return {
        filesTranslated: 0,
        status: 'up-to-date'
      };
    }
    
    console.log(`\n🔍 Found ${modifiedFiles.length} modified files since last run (${lastRunDate.toISOString()}):`);
    modifiedFiles.forEach(file => {
      const relativePath = path.relative(path.join(this.baseDir, this.sourceLanguage), file);
      console.log(`   → ${relativePath}`);
    });
    
    console.log(`\n🌐 Translating to languages: ${this.targetLanguages.join(', ')}\n`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const sourceFilePath of modifiedFiles) {
      for (const targetLang of this.targetLanguages) {
        const result = await this.translateFile(sourceFilePath, targetLang);
        if (result) {
          successCount++;
        } else {
          errorCount++;
        }
      }
    }

    const currentTime = new Date().toISOString();
    this.writeTrackerFile({
      lastRun: currentTime
    });

    console.log(`\n📊 Translation Summary:`);
    console.log(`   ✓ Successfully translated: ${successCount} files`);
    if (errorCount > 0) {
      console.log(`   ✗ Failed translations: ${errorCount}`);
    }
    console.log(`   📅 Translation completed at: ${currentTime}`);
    console.log('\n=== File Translation Service End ===\n');

    return {
      filesTranslated: successCount,
      status: 'translated'
    };
  }
}

if (require.main === module) {
  if (process.argv[2] === 'files') {
    const translator = new FileTranslationService();
    translator.translateAllFiles()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Translation failed:', error);
        process.exit(1);
      });
  } else {
    console.log('Usage: npm run translate files');
    process.exit(1);
  }
}

export default FileTranslationService;