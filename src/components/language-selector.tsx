import React, { useState, useEffect } from 'react';
import defaultContent from '../../localization/language-files/en/components/language-selector.json';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  showPrompt?: boolean;
  onLanguageChange?: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  showPrompt = true,
  onLanguageChange 
}) => {
  
  const [content, setContent] = useState(defaultContent.content);
const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  // Available languages - hardcoded for now
  const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setIsOpen(false);
    
    // Dispatch custom event for components/pages to listen to
    const event = new CustomEvent('languageChange', {
      detail: { language: languageCode }
    });
    window.dispatchEvent(event);
    
    // Call parent callback if provided
    if (onLanguageChange) {
      onLanguageChange(languageCode);
    }
    
    // Store in sessionStorage for persistence
    sessionStorage.setItem('selectedLanguage', languageCode);
  };

  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = sessionStorage.getItem('selectedLanguage');
    if (savedLanguage && savedLanguage !== selectedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  const currentLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        <span style={{ fontSize: '18px' }}>{currentLang.flag}</span>
        <span>{currentLang.name}</span>
        <span style={{ fontSize: '12px' }}>{content.text_1}</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
            marginTop: '2px'
          }}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                backgroundColor: selectedLanguage === language.code ? '#f0f0f0' : 'white',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '18px' }}>{language.flag}</span>
              <span>{language.name}</span>
              {selectedLanguage === language.code && (
                <span style={{ marginLeft: 'auto', color: '#007bff' }}>{content.text_2}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;