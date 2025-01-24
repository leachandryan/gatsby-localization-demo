import React, { useState, useEffect } from "react";
import LanguageSelector from './language-selector';
import defaultContent from '../../localization/language-files/en/components/language-detection-provider.json';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const LayoutWithLanguage: React.FC<LayoutProps> = ({ children, title = "My Website" }) => {
  
  

  useEffect(() => {
    const handleLanguageChange = async (event: any) => {
      try {
        const { language } = event.detail;
        
        if (language) {
          try {
            const langModule = await import(`../../localization/language-files/${language}/components/language-detection-provider.json`);
            setContent(langModule.default.content);
          } catch (error) {
            console.error(`Failed to load language ${language}:`, error);
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
  }, []);const [content, setContent] = useState(defaultContent.content);
return (
    <div>
      {/* Header with Language Selector */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#fff'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          {title}
        </h1>
        
        {/* Language Selector in Header */}
        <LanguageSelector 
          showPrompt={true}
          onLanguageChange={(lang) => {
            console.log('Language changed to:', lang);
          }}
        />
      </header>

      {/* Main Content */}
      <main style={{ padding: '24px' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #eee',
        padding: '16px 24px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>{content.text_1}</p>
      </footer>
    </div>
  );
};

export default LayoutWithLanguage;