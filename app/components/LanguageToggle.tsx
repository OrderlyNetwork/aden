import { useState, useEffect } from "react";
import { i18n } from "@orderly.network/i18n";

export default function LanguageToggle() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    // Get initial language from localStorage or default to "en"
    const getInitialLang = () => {
      if (typeof window !== "undefined") {
        const savedLang = localStorage.getItem("lang");
        if (savedLang) return savedLang;
      }
      return i18n.language === "ko" ? "ko" : "en";
    };

    setLang(getInitialLang());
  }, []);

  const handleLanguageToggle = () => {
    const nextLang = lang === "en" ? "ko" : "en";
    
    // Update the language immediately
    setLang(nextLang);
    i18n.changeLanguage(nextLang);
    
    // Persist to localStorage
    localStorage.setItem("lang", nextLang);
  };

  return (
    <button
      onClick={handleLanguageToggle}
      type="button"
      className="oui-px-3 oui-py-1.5 oui-text-black oui-font-bold hover:oui-opacity-80 oui-rounded-lg oui-border oui-border-line oui-transition-all oui-text-sm"
      style={{ backgroundColor: "#fdb41d", color: "black" }}
    >
      {lang === "en" ? "한국어" : "English"}
    </button>
  );
} 