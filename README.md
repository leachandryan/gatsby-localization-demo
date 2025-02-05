# 🌍 Gatsby Localization System

> **Transform your Gatsby site into a multilingual powerhouse with automated extraction, translation, and dynamic language switching.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gatsby](https://img.shields.io/badge/Gatsby-663399?style=for-the-badge&logo=gatsby&logoColor=white)](https://www.gatsbyjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Google Translate](https://img.shields.io/badge/Google%20Translate-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://cloud.google.com/translate)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

## 📋 Public Demo Version

**This is the public demonstration version** showcasing core localization functionality:
- **Automated Text Extraction** - Smart component scanning and intelligent filtering
- **AI-Powered Translation** - Google Translate integration with batch processing
- **Dynamic Language Switching** - Zero page reloads with browser detection
- **TypeScript First** - Fully typed codebase with excellent IDE support
- **CLI Tools** - Simple, intuitive command-line interface
- **Backup & Restore** - Safe extraction with automatic file backups

**My private enterprise version** includes all public features plus advanced capabilities:
- **URL/Slug Localization** - Automatic translation of page URLs and meta paths
- **Metadata & SEO Optimization** - Translation of meta descriptions, titles, and structured data
- **Category & Post Management** - Dynamic content localization for CMS-driven sites
- **WordPress Integrations** - Direct plugin support for WordPress sites and headless CMS
- **Translation Efficiency Logic** - Preserves manual translations and avoids re-translating unchanged content
- **Enterprise Support & Custom Integrations**

**Contact me to discuss getting access to my private enterprise version for use in your current Node.js TypeScript project.**

## 🔥 Why This Approach Works

### **Static Site & SEO Optimized**
Unlike traditional i18n solutions that rely on client-side routing, this system:
- **Generates static language files** - Works with any static site generator (Gatsby, Next.js, etc.)
- **SEO-friendly by design** - Search engines can crawl and index all language versions
- **Zero JavaScript overhead** - Translation files are loaded dynamically only when needed
- **Works with existing infrastructure** - No complex routing or server-side rendering required

### **Revolutionary Text Extraction**
Most i18n tools require developers to manually wrap text in translation functions. This system:
- **Automatically retrofits existing sites** - Extracts hardcoded text without manual refactoring
- **Preserves development workflow** - Write normal JSX, extraction happens automatically
- **Intelligent content detection** - Distinguishes between translatable text and code

---

## ✨ Features

### 🚀 **Automated Text Extraction**
- **Smart Component Scanning**: Automatically detects and extracts translatable text from React components and pages
- **Intelligent Filtering**: Skips code, variables, and non-translatable content
- **Backup & Restore**: Safe extraction with automatic file backups and one-click restoration

### 🤖 **AI-Powered Translation**
- **Google Translate Integration**: Leverages Google's industry-leading translation API
- **Batch Processing**: Translates all your content in one command
- **Smart Caching**: Only translates new or modified content
- **Format Preservation**: Maintains your original text structure and formatting

### ⚡ **Dynamic Language Switching**
- **Zero Page Reloads**: Instant language switching without refreshing
- **Browser Detection**: Automatically detects user's preferred language
- **Session Persistence**: Remembers user's language choice
- **Custom Events**: React components automatically update when language changes

### 🎯 **Developer Experience**
- **TypeScript First**: Fully typed codebase with excellent IDE support
- **Granular Control**: Extract/restore individual files or entire directories
- **CLI Tools**: Simple, intuitive command-line interface
- **Hot Module Replacement**: Works seamlessly with Gatsby's development server

---

## 🚀 Quick Start

### 1. **Installation**

```bash
# Clone or copy the localization system files to your Gatsby project
# Install required dependencies
npm install cheerio dotenv glob ts-node typescript
npm install --save-dev @types/node @types/react @types/react-dom @types/cheerio
```

### 2. **Environment Setup**

Create a `.env` file in your project root:

```bash
# Language Configuration
SOURCE_LANGUAGE=en
TARGET_LANGUAGES=fr,de,es,it

# Google Translate API Key (get from Google Cloud Console)
GOOGLE_API_KEY=your_google_translate_api_key_here
```

### 3. **Extract Your Content**

```bash
# Extract text from all pages and components
npm run extract:pages
npm run extract:components

# Or extract individual files
npm run extract:pages -- index.tsx
npm run extract:components -- hero.tsx
```

### 4. **Translate Everything**

```bash
# Translate all extracted content to target languages
npm run translate
```

### 5. **Add Language Selector**

```jsx
import LanguageSelector from '../components/language-selector';

const MyPage = () => {
  return (
    <div>
      <header>
        <h1>My Website</h1>
        <LanguageSelector />
      </header>
      {/* Your content will automatically switch languages! */}
    </div>
  );
};
```

---

## 📖 How It Works

### **The Magic Behind the Scenes**

1. **🔍 Extraction Phase**
   - Scans your React components and pages
   - Identifies translatable text using advanced parsing
   - Creates JSON language files with unique keys
   - Modifies your components to use dynamic content loading

2. **🌐 Translation Phase**
   - Connects to Google Translate API
   - Processes all extracted text in batches
   - Creates translated versions for each target language
   - Maintains file structure and organization

3. **⚡ Runtime Phase**
   - Language selector dispatches custom events
   - Components listen for language changes
   - Dynamic imports load translated content
   - UI updates instantly without page reloads

4. **⚡ Restore Phase**
   - Restore pages and componets back to original state to make addtional changes
   - Changes can be made to components and extracted and translate again to update language files to any changes. 

### **File Structure After Extraction**

```
localization/
├── language-files/
│   ├── en/                    # Source language
│   │   ├── components/
│   │   │   ├── hero.json
│   │   │   └── navigation.json
│   │   └── pages/
│   │       ├── index.json
│   │       └── about.json
│   ├── fr/                    # French translations
│   ├── de/                    # German translations
│   └── es/                    # Spanish translations
├── original-files/            # Backup of original files
├── component-extraction.ts    # Component processing
├── page-extraction.ts         # Page processing
└── file-translation.ts        # Translation engine
```

---

## 🛠️ CLI Commands

### **Pages**
```bash
# Extract all pages
npm run extract:pages

# Extract specific page
npm run extract:pages -- about.tsx

# Restore all pages to original state
npm run restore:pages

# Restore specific page
npm run restore:pages -- about.tsx
```

### **Components**
```bash
# Extract all components
npm run extract:components

# Extract specific component
npm run extract:components -- navigation.tsx

# Restore all components
npm run restore:components

# Restore specific component
npm run restore:components -- navigation.tsx
```

### **Translation**
```bash
# Translate all extracted content
npm run translate

# Translation runs automatically on all JSON files
# No need for individual file translation
```

---

## ⚙️ Configuration

### **Language Settings**

Customize your supported languages in `.env`:

```bash
# Source language (your default content language)
SOURCE_LANGUAGE=en

# Target languages (comma-separated)
TARGET_LANGUAGES=fr,de,es,it,pt,nl,ru,ja,ko,zh
```

### **Google Translate API**

1. **Get API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Cloud Translation API
   - Create credentials and get your API key

2. **Add to Environment**:
   ```bash
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

### **Custom Language Mappings**

The system supports these languages out of the box:

| Code | Language | Flag |
|------|----------|------|
| `en` | English | 🇺🇸 |
| `fr` | Français | 🇫🇷 |
| `de` | Deutsch | 🇩🇪 |
| `es` | Español | 🇪🇸 |
| `it` | Italiano | 🇮🇹 |
| `pt` | Português | 🇵🇹 |
| `nl` | Nederlands | 🇳🇱 |
| `ru` | Русский | 🇷🇺 |
| `ja` | 日本語 | 🇯🇵 |
| `ko` | 한국어 | 🇰🇷 |
| `zh` | 中文 | 🇨🇳 |

---

## 🎨 Component Integration

### **Before Extraction**
```jsx
const Hero = () => {
  return (
    <div>
      <h1>Welcome to Our Website</h1>
      <p>Experience the power of translation</p>
      <button>Get Started</button>
    </div>
  );
};
```

### **After Extraction** ✨
```jsx
import React, { useState, useEffect } from 'react';
import defaultContent from '../../localization/language-files/en/components/hero.json';

const Hero = () => {
  const [content, setContent] = useState(defaultContent.content);
  
  useEffect(() => {
    const handleLanguageChange = async (event) => {
      const { language } = event.detail;
      if (language) {
        try {
          const langModule = await import(`../../localization/language-files/${language}/components/hero.json`);
          setContent(langModule.default.content);
        } catch (error) {
          setContent(defaultContent.content);
        }
      }
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  return (
    <div>
      <h1>{content.text_1}</h1>
      <p>{content.text_2}</p>
      <button>{content.text_3}</button>
    </div>
  );
};
```

---

## 🔧 Advanced Usage

### **Custom Event Handling**

Listen for language changes in any component:

```jsx
useEffect(() => {
  const handleLanguageChange = (event) => {
    console.log('Language changed to:', event.detail.language);
    // Your custom logic here
  };

  window.addEventListener('languageChange', handleLanguageChange);
  return () => window.removeEventListener('languageChange', handleLanguageChange);
}, []);
```

### **Manual Language Switching**

```jsx
const switchToFrench = () => {
  const event = new CustomEvent('languageChange', {
    detail: { language: 'fr' }
  });
  window.dispatchEvent(event);
};
```

### **Exclude Content from Translation**

The system automatically skips:
- Code blocks and variables (`{variable}`)
- Function expressions (`() => {}`)
- Special characters and symbols
- URLs and email addresses
- Gatsby `Head` export functions

---

## 🚨 Troubleshooting

### **Common Issues**

**❌ "content is not defined" Error**
```bash
# Restore files and re-extract
npm run restore:pages
npm run restore:components
npm run extract:pages
npm run extract:components
```

**❌ Translation API Errors**
- Verify your Google API key is correct
- Check that Cloud Translation API is enabled
- Ensure you have billing set up on Google Cloud

**❌ Import Path Issues**
- Check that JSON files exist in the correct directories
- Verify the relative import paths are correct
- Clear Gatsby cache: `gatsby clean`

### **Debug Mode**

Enable verbose logging by checking the console output during extraction. The system provides detailed feedback about what it's processing.

---

## 🧪 Testing

### **Comprehensive Jest Test Suite**

The system includes a robust testing framework covering all core functionality:

```bash
# Run all tests
npm test

# Run tests in watch mode  
npm run test:watch

# Run specific test suites
npm test -- file-translation
npm test -- component-extraction
```

### **Test Coverage**

Located in the `tests/` directory with organized test suites:

- **`tests/env-variables/`** - Environment variable validation
- **`tests/file-translation/`** - Translation service logic and API integration
- **`tests/component-extraction/`** - Text extraction and file modification
- **`tests/page-extraction/`** - Page processing and backup systems

### **Testing Features**
- **Unit tests** for all core functionality
- **Mock implementations** for external dependencies (Google Translate API, filesystem)
- **TypeScript support** with full type checking
- **Isolated test environments** with proper cleanup
- **Environment variable validation** to catch configuration issues early

### **Example Test Run**
```bash
✓ Environment Variables (4 tests)
✓ File Translation Logic (5 tests)  
✓ Path Module Operations (6 tests)
✓ FS Module Operations (12 tests)

Test Suites: 4 passed
Tests: 27 passed
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Translate API** for powerful translation capabilities
- **Gatsby** for the amazing static site generation framework
- **Cheerio** for reliable HTML/JSX parsing
- **TypeScript** for type safety and reliability  

---

<div align="center">

*Transform your Gatsby site into a multilingual experience that reaches users worldwide.*

</div>