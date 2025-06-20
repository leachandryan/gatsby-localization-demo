import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import languages from '../../../localization/available-languages.json';
import FileTranslationService from '../../../localization/file-translation';
import { jest } from '@jest/globals';

describe('Environment Variables', () => {
  beforeAll(() => {
    dotenv.config({ path: `${__dirname}/../../../.env` });
  });

  test('all required environment variables should be set and valid', () => {
    const apiKey = process.env.GOOGLE_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toMatch(/^AIza[0-9A-Za-z_-]{35}$/);

    const projectId = process.env.GOOGLE_PROJECT_ID;
    expect(projectId).toBeDefined();
    expect(projectId).toMatch(/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/);

    const sourceLanguage = process.env.SOURCE_LANGUAGE;
    expect(sourceLanguage).toBeDefined();
    expect(languages.languages.map((lang: { code: string }) => lang.code)).toContain(sourceLanguage);

    const targetLanguages = process.env.TARGET_LANGUAGES;
    expect(targetLanguages).toBeDefined();
    if (targetLanguages) {
      const codes = targetLanguages.split(',');
      expect(codes.length).toBeGreaterThan(0);
      codes.forEach(code => {
        expect(languages.languages.map((lang: { code: string }) => lang.code)).toContain(code);
      });
    }
  });
});

describe('File Translation Logic', () => {
  let testDir: string;
  let translationService: FileTranslationService;
  const TRACKER_DATE = new Date('2024-04-01T12:00:00Z');
  const OLD_FILE_DATE = new Date('2024-03-31T12:00:00Z');
  const NEW_FILE_DATE = new Date('2024-04-02T12:00:00Z');
  
  const getModifiedFilesSpy = jest.spyOn(FileTranslationService.prototype as any, 'getModifiedFiles');
  
  beforeAll(() => {
    dotenv.config({ path: `${__dirname}/../../../.env` });
  });
  
  beforeEach(() => {
    // Set up test directory
    testDir = path.join(__dirname, 'test-localization');
    jest.spyOn(process, 'cwd').mockImplementation(() => testDir);

    // Create source directory with proper path structure
    const sourceDir = path.join(testDir, 'localization', 'language-files', process.env.SOURCE_LANGUAGE || 'en');
    fs.mkdirSync(sourceDir, { recursive: true });

    // Create tracker file with static date
    const trackerPath = path.join(testDir, 'localization', 'language-files', 'translation-tracker.json');
    fs.writeFileSync(trackerPath, JSON.stringify({ lastRun: TRACKER_DATE.toISOString() }, null, 2));

    // Create and set dates for test files
    const oldFile = path.join(sourceDir, 'old-content.json');
    const newFile = path.join(sourceDir, 'new-content.json');
    
    fs.writeFileSync(oldFile, JSON.stringify({ test: "old content" }));
    fs.writeFileSync(newFile, JSON.stringify({ test: "new content" }));
    
    fs.utimesSync(oldFile, OLD_FILE_DATE, OLD_FILE_DATE);
    fs.utimesSync(newFile, NEW_FILE_DATE, NEW_FILE_DATE);

    // Mock readTrackerFile to return our static date
    jest.spyOn(FileTranslationService.prototype as any, 'readTrackerFile')
      .mockImplementation(() => ({ lastRun: TRACKER_DATE.toISOString() }));
    
    translationService = new FileTranslationService();
  });
  
  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
    jest.clearAllMocks();
  });
  
  test('getModifiedFiles should identify only files modified after last run', async () => {
    const result = await translationService.translateAllFiles();
    const modifiedFiles = getModifiedFilesSpy.mock.results[0].value as string[];
    
    console.log('Modified files:', modifiedFiles);
    console.log('Old file date:', OLD_FILE_DATE.toISOString());
    console.log('Tracker date:', TRACKER_DATE.toISOString());
    console.log('New file date:', NEW_FILE_DATE.toISOString());
    
    expect(modifiedFiles.length).toBe(1);
    expect(modifiedFiles[0]).toMatch(/new-content\.json$/);
    expect(modifiedFiles.some((file: string) => file.includes('old-content.json'))).toBe(false);
  });
  
  test('getModifiedFiles should properly compare file modification dates', async () => {
    const modifiedFiles = (translationService as any).getModifiedFiles(TRACKER_DATE) as string[];
    
    expect(modifiedFiles.length).toBeGreaterThan(0);
    modifiedFiles.forEach((file: string) => {
      const stats = fs.statSync(file);
      expect(stats.mtime.getTime()).toBeGreaterThan(TRACKER_DATE.getTime());
    });
  });
  
  test('translation service should process only files needing translation', async () => {
    const translateFileSpy = jest.spyOn(translationService as any, 'translateFile')
      .mockImplementation((...args: unknown[]) => Promise.resolve(args[0] as string));
    
    await translationService.translateAllFiles();
    
    const processedFiles = translateFileSpy.mock.calls.map(call => call[0] as string);
    expect(processedFiles.length).toBeGreaterThan(0);
    processedFiles.forEach((file: string) => {
      expect(file).toMatch(/new-content\.json$/);
      expect(file).not.toMatch(/old-content\.json$/);
    });
    
    const targetLangs = process.env.TARGET_LANGUAGES?.split(',') || [];
    expect(processedFiles.length).toBe(targetLangs.length);
  });
});