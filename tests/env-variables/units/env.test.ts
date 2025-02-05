import dotenv from 'dotenv';
import languages from '../../../localization/available-languages.json';

describe('Environment Variables', () => {
  beforeAll(() => {
    dotenv.config({ path: `${__dirname}/../../../.env` });
  });

  const languageCodes = languages.languages.map((lang: { code: string }) => lang.code);

  test('GOOGLE_API_KEY should be set and valid', () => {
    const apiKey = process.env.GOOGLE_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toMatch(/^AIza[0-9A-Za-z_-]{35}$/);
  });

  test('GOOGLE_PROJECT_ID should be set and valid', () => {
    const projectId = process.env.GOOGLE_PROJECT_ID;
    expect(projectId).toBeDefined();
    expect(projectId).toMatch(/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/);
  });

  test('SOURCE_LANGUAGE should be set and valid', () => {
    const sourceLanguage = process.env.SOURCE_LANGUAGE;
    expect(sourceLanguage).toBeDefined();
    expect(languageCodes).toContain(sourceLanguage);
  });

  test('TARGET_LANGUAGES should be set and valid', () => {
    const targetLanguages = process.env.TARGET_LANGUAGES;
    expect(targetLanguages).toBeDefined();

    if (targetLanguages) {
      const codes = targetLanguages.split(',');
      expect(codes.length).toBeGreaterThan(0);
      codes.forEach(code => {
        expect(languageCodes).toContain(code);
      });
    }
  });
});