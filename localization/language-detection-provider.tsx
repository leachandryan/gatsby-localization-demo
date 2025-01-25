import React, { createContext, useContext, useEffect, useState } from 'react';
import { getLanguageService, Language, LanguageConfig } from './language-detection';

interface LanguageContextType {
  currentLanguage: string;
  availableLanguages: Language[];
  config: LanguageConfig;
  setLanguage: (language: string) => void;
  shouldShowPrompt: boolean;
  suggestedLanguage: string | null;
  acceptSuggestion: () => void;
  declineSuggestion: () => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageDetectionProviderProps {
  children: React.ReactNode;
}

export const LanguageDetectionProvider: React.FC<LanguageDetectionProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [config, setConfig] = useState<LanguageConfig | null>(null);
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const [suggestedLanguage, setSuggestedLanguage] = useState<string | null>(null);

  const languageService = getLanguageService();

  useEffect(() => {
    // Initialize language service
    languageService.initialize();
    
    // Set initial state
    setCurrentLanguage(languageService.getCurrentLanguage());
    setAvailableLanguages(languageService.getAvailableLanguages());
    setConfig(languageService.getConfig());
    
    // Check for browser language prompt
    if (languageService.shouldPromptLanguageChange()) {
      setShouldShowPrompt(true);
      setSuggestedLanguage(languageService.getSuggestedLanguage());
    }

    // Listen for language changes
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const setLanguage = (language: string) => {
    languageService.setLanguage(language);
  };

  const acceptSuggestion = () => {
    languageService.acceptBrowserLanguage();
    setShouldShowPrompt(false);
  };

  const declineSuggestion = () => {
    languageService.declineBrowserLanguage();
    setShouldShowPrompt(false);
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    availableLanguages,
    config: config || {
      sourceLanguage: 'en',
      targetLanguages: [],
      availableLanguages: []
    },
    setLanguage,
    shouldShowPrompt,
    suggestedLanguage,
    acceptSuggestion,
    declineSuggestion
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguageDetection = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageDetection must be used within a LanguageDetectionProvider');
  }
  return context;
};

// HOC for components that need language context
export function withLanguageDetection<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function LanguageDetectionWrappedComponent(props: P) {
    return (
      <LanguageDetectionProvider>
        <Component {...props} />
      </LanguageDetectionProvider>
    );
  };
}