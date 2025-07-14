import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import translations, { Language, TranslationDictionary } from './translations';
import { getCookie, setCookie } from '@/utils/cookies';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  exists: (key: string) => boolean;
}

const defaultContextValue: TranslationContextType = {
  language: 'EN',
  setLanguage: () => {},
  t: (key: string) => key,
  exists: () => false,
};

const TranslationContext = createContext<TranslationContextType>(defaultContextValue);

export const useTranslation = () => useContext(TranslationContext);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('EN');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load saved language preference
    // const savedLanguage = getCookie('anttalk-language');
    // if (savedLanguage && (savedLanguage === 'EN' || savedLanguage === 'KO')) {
    //   setLanguageState(savedLanguage as Language);
    // }

    // Load language from localStorage if available
    const savedLanguage = localStorage.getItem('lang');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ko')) {
      setLanguageState(savedLanguage.toUpperCase() as Language);
    } else {
      // Default to English if no preference is set
      setLanguageState('EN');
    }
  }, []);

  // Save language preference when it changes
  useEffect(() => {
    if (mounted) {
      // setCookie('anttalk-language', language);
      localStorage.setItem('lang', language.toLowerCase());
    }
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lang", lang.toLowerCase());
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translation[language];
  };

  const exists = (key: string): boolean => {
    return !!translations[key];
  };

  const contextValue: TranslationContextType = {
    language,
    setLanguage,
    t,
    exists,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationProvider; 