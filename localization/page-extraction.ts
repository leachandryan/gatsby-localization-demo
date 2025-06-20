#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import * as cheerio from 'cheerio';

// Simple file finder to replace glob
function findFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  function searchDir(currentDir: string) {
    if (!fs.existsSync(currentDir)) return;
    
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        searchDir(fullPath);
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  searchDir(dir);
  return files;
}

interface PageContent {
  title: string;
  pagePath: string;
  lastModified: string;
  meta: {
    description: string;
  };
  content: Record<string, string>;
}

export class PageExtractionService {
  private sourceLanguage: string;
  private backupDir: string;
  private pagesDir: string;
  private outputDir: string;

  constructor() {
    this.sourceLanguage = process.env.SOURCE_LANGUAGE || 'en';
    this.backupDir = path.join('localization', 'original-files', 'pages');
    this.pagesDir = './src/pages';
    this.outputDir = path.join('localization', 'language-files', this.sourceLanguage, 'pages');
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      console.log('📁 Creating directory: ' + dirPath);
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private backupFile(filePath: string): void {
    const fileName = path.basename(filePath);
    this.ensureDirectoryExists(this.backupDir);
    
    const backupPath = path.join(this.backupDir, fileName);
    
    try {
      fs.copyFileSync(filePath, backupPath);
      console.log('📑 Backed up file to:', backupPath);
    } catch (error) {
      console.error('❌ Error backing up file:', (error as Error).message);
    }
  }

  private modifyFile(filePath: string, jsonContent: PageContent): boolean {
    try {
      console.log('\n📝 Modifying file:', path.basename(filePath));
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      let modifiedContent = fileContent;

      const fileName = path.basename(filePath).replace(/\.[^/.]+$/, '');
      const relativePath = path.relative(
        path.dirname(filePath),
        path.join('localization', 'language-files', this.sourceLanguage, 'pages', fileName + '.json')
      ).replace(/\\/g, '/');
      
      // Check for React import and modify if needed
      const reactImportRegex = /import (?:\* as React|React(?:,\s*{([^}]+)})?)\s*from\s*["']react["']/;
      const reactMatch = modifiedContent.match(reactImportRegex);
      
      if (!reactMatch) {
        console.error('❌ No React import found in page');
        return false;
      }

      // Handle different import patterns
      let existingImports = '';
      if (modifiedContent.includes('import * as React')) {
        // For "import * as React", we need to convert to named imports
        modifiedContent = modifiedContent.replace(
          /import \* as React from ["']react["']/,
          `import React, { useState, useEffect } from "react"`
        );
      } else {
        // Handle regular React imports
        existingImports = reactMatch[1] || '';
        const neededImports = [];
        
        if (!existingImports.includes('useState')) {
          neededImports.push('useState');
        }
        if (!existingImports.includes('useEffect')) {
          neededImports.push('useEffect');
        }

        if (neededImports.length > 0) {
          const allImports = existingImports ? 
            `${existingImports.trim()}, ${neededImports.join(', ')}` : 
            neededImports.join(', ');
          
          modifiedContent = modifiedContent.replace(
            reactMatch[0],
            `import React, { ${allImports} } from "react"`
          );
        }
      }

      // Add defaultContent import if it doesn't exist
      const defaultContentImport = `import defaultContent from '${relativePath}';`;
      if (!modifiedContent.includes(defaultContentImport)) {
        // Find the last import statement
        const importRegex = /^import.*?;$/gm;
        const imports = modifiedContent.match(importRegex);
        
        if (imports && imports.length > 0) {
          const lastImport = imports[imports.length - 1];
          modifiedContent = modifiedContent.replace(
            lastImport,
            `${lastImport}\n${defaultContentImport}`
          );
        } else {
          // If no imports found, add at the beginning
          modifiedContent = `${defaultContentImport}\n${modifiedContent}`;
        }
      }

      // Add useState if not present (do this AFTER adding the defaultContent import)
      if (!modifiedContent.includes('const [content, setContent]')) {
        // Look for component declaration patterns
        const componentPatterns = [
          /const\s+\w+\s*:\s*React\.FC\s*=\s*\(\s*[^)]*\)\s*=>\s*{\s*/,
          /const\s+\w+\s*:\s*React\.FC<[^>]*>\s*=\s*\(\s*[^)]*\)\s*=>\s*{\s*/,
          /const\s+\w+\s*=\s*\(\s*[^)]*\)\s*:\s*JSX\.Element\s*=>\s*{\s*/,
          /const\s+\w+\s*=\s*\(\s*[^)]*\)\s*=>\s*{\s*/
        ];
        
        let componentStart = null;
        for (const pattern of componentPatterns) {
          componentStart = modifiedContent.match(pattern);
          if (componentStart) break;
        }
        
        if (componentStart) {
          const stateDeclaration = '  const [content, setContent] = useState(defaultContent.content);';
          modifiedContent = modifiedContent.replace(
            componentStart[0],
            `${componentStart[0]}\n${stateDeclaration}\n`
          );
        } else {
          console.warn('⚠️  Could not find component declaration to add useState');
          console.log('Component content preview:', modifiedContent.substring(0, 200));
        }
      }

      // Add useEffect for language handling if it doesn't exist
      if (!modifiedContent.includes('languageChange')) {
        const useEffectCode = `
  useEffect(() => {
    const handleLanguageChange = async (event: any) => {
      try {
        const { language } = event.detail;
        
        if (language) {
          try {
            const langModule = await import(\`../../localization/language-files/\${language}/pages/${fileName}.json\`);
            setContent(langModule.default.content);
          } catch (error) {
            console.error(\`Failed to load language \${language}:\`, error);
            setContent(defaultContent.content);
          }
        }
      } catch (error) {
        console.error('Error loading content:', error);
        setContent(defaultContent.content);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);`;

        // Look for component declaration patterns
        const componentPatterns = [
          /const\s+\w+\s*:\s*React\.FC\s*=\s*\(\s*[^)]*\)\s*=>\s*{\s*/,
          /const\s+\w+\s*:\s*React\.FC<[^>]*>\s*=\s*\(\s*[^)]*\)\s*=>\s*{\s*/,
          /const\s+\w+\s*=\s*\(\s*[^)]*\)\s*:\s*JSX\.Element\s*=>\s*{\s*/,
          /const\s+\w+\s*=\s*\(\s*[^)]*\)\s*=>\s*{\s*/
        ];
        
        let componentStart = null;
        for (const pattern of componentPatterns) {
          componentStart = modifiedContent.match(pattern);
          if (componentStart) break;
        }
        
        if (componentStart) {
          modifiedContent = modifiedContent.replace(
            componentStart[0],
            `${componentStart[0]}\n${useEffectCode}`
          );
        } else {
          console.warn('⚠️  Could not find component declaration to add useEffect');
          console.log('Component content preview:', modifiedContent.substring(0, 200));
        }
      }

      // Replace text with references to JSON keys (but skip Head export)
      Object.entries(jsonContent.content).forEach(([key, text]) => {
        const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Split content to avoid modifying Head export
        const headExportIndex = modifiedContent.indexOf('export const Head');
        
        if (headExportIndex !== -1) {
          // Only replace in the part before Head export
          const beforeHead = modifiedContent.substring(0, headExportIndex);
          const afterHead = modifiedContent.substring(headExportIndex);
          
          const regex = new RegExp(`(>)\\s*${escapedText}\\s*(<)`, 'g');
          const modifiedBeforeHead = beforeHead.replace(regex, `$1{content.${key}}$2`);
          
          modifiedContent = modifiedBeforeHead + afterHead;
        } else {
          // Normal replacement if no Head export
          const regex = new RegExp(`(>)\\s*${escapedText}\\s*(<)`, 'g');
          modifiedContent = modifiedContent.replace(regex, `$1{content.${key}}$2`);
        }
      });
      
      fs.writeFileSync(filePath, modifiedContent, 'utf8');
      console.log('✓ File modified successfully');
      console.log('  - Added imports');
      console.log('  - Added language switching');
      console.log('  - Replaced text with JSON references');
      
      return true;
    } catch (error) {
      console.error('❌ Error modifying file:', (error as Error).message);
      return false;
    }
  }

  private extractInnerText(fileContent: string): Record<string, string> {
    // Convert JSX-style self-closing tags to HTML-style for Cheerio
    fileContent = fileContent.replace(/(\s+\w+)=\{([^}]+)\}/g, '$1="$2"');
    
    const $ = cheerio.load(fileContent, {
      xmlMode: true
    });

    const texts: string[] = [];
    
    $('*').each(function() {
      const text = $(this).contents()
        .filter(function() {
          return this.type === 'text';
        })
        .text()
        .trim();

      if (text && 
          !text.match(/^[{()}]+$/) && 
          !text.includes('{') &&      
          !text.includes('}') &&
          !text.includes('&&') &&     
          !text.includes('=>') &&     
          text.length > 0) {          
        texts.push(text);
      }
    });

    const uniqueTexts = [...new Set(texts)];

    return uniqueTexts.reduce((acc, text, index) => {
      acc[`text_${index + 1}`] = text;
      return acc;
    }, {} as Record<string, string>);
  }

  public processAllFiles(): void {
    console.log('\n=== Processing All Pages ===');
    
    this.ensureDirectoryExists(this.outputDir);
    
    console.log('🔍 Scanning for page files...');
    const pages = findFiles(this.pagesDir, ['.js', '.jsx', '.tsx']);
    console.log('📊 Found ' + pages.length + ' pages to process');
    
    let processedCount = 0;

    for (const pagePath of pages) {
      try {
        this.backupFile(pagePath);

        const fileName = path.basename(pagePath).replace(/\.[^/.]+$/, '');
        const outputPath = path.join(this.outputDir, `${fileName}.json`);
        
        console.log(`\n📝 Processing: ${fileName}`);
        
        const fileContent = fs.readFileSync(pagePath, 'utf8');
        const extractedContent = this.extractInnerText(fileContent);
        
        const pageContent: PageContent = {
          title: fileName,
          pagePath: pagePath,
          lastModified: new Date().toISOString(),
          meta: {
            description: ""
          },
          content: extractedContent
        };

        fs.writeFileSync(outputPath, JSON.stringify(pageContent, null, 2));
        console.log(`✓ Created: ${outputPath}`);
        
        this.modifyFile(pagePath, pageContent);
        processedCount++;
        
      } catch (error) {
        console.error('❌ Error processing page ' + pagePath + ':', (error as Error).message);
      }
    }

    console.log(`\n✅ Processing complete: ${processedCount} pages processed`);
  }

  public restoreAllFiles(): void {
    console.log('\n=== Restoring All Pages ===');
    
    if (!fs.existsSync(this.backupDir)) {
      console.error('❌ No backup directory found at:', this.backupDir);
      return;
    }

    const files = findFiles(this.backupDir, ['.js', '.jsx', '.tsx']);
    console.log('📊 Found ' + files.length + ' files to restore');

    if (files.length === 0) {
      console.log('❌ No files found to restore');
      return;
    }

    let successCount = 0;

    files.forEach((backupPath: string) => {
      const fileName = path.basename(backupPath);
      const targetPath = path.join(this.pagesDir, fileName);

      try {
        fs.copyFileSync(backupPath, targetPath);
        console.log('✓ Restored:', fileName);
        successCount++;
      } catch (error) {
        console.error('❌ Error restoring ' + fileName + ':', (error as Error).message);
      }
    });

    console.log(`\n✅ Restoration complete: ${successCount} files restored`);
  }
}

// CLI Setup
if (require.main === module) {
  const args = process.argv.slice(2);
  const service = new PageExtractionService();

  if (args.length === 0) {
    console.log('\n❌ Invalid command format');
    console.log('\nUsage:');
    console.log('  npm run extract:pages');
    console.log('  npm run restore:pages');
    process.exit(1);
  }

  const command = args[0];

  if (command === 'extract') {
    service.processAllFiles();
  } else if (command === 'restore') {
    service.restoreAllFiles();
  } else {
    console.log('\n❌ Invalid command:', command);
    console.log('Valid commands are: extract, restore');
    process.exit(1);
  }
}