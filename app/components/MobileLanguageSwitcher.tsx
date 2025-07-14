import React from 'react';
import { useTranslation } from '../i18n/TranslationContext';
import { ChevronDown, ChevronDownIcon } from 'lucide-react';
import { Language } from '~/i18n/translations';
import { useState } from 'react';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="dc-relative dc-ml-auto">
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
    </div>
  );
};

export default LanguageSwitcher; 