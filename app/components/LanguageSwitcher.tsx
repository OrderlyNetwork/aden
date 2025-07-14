import React from 'react';
import { useTranslation } from '../i18n/TranslationContext';

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '', compact = false }) => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className={`dc-flex dc-items-center dc-justify-center dc-font-bold dc-bg-gradient-to-br dc-p-8 dc-w-88 dc-h-26 ${className}`}>
      {language === 'EN' ? (
        <button id="drinkcodeChangeLocaleButtonDiv" className='' onClick={() => setLanguage('KO')}>
          한국어
        </button>
      ) : (
        <button id="drinkcodeChangeLocaleButtonDiv" className='' onClick={() => setLanguage('EN')}>
          English
        </button>
      )}
    </div>
  );
};

export default LanguageSwitcher; 