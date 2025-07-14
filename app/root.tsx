import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import OrderlyProvider from "@/components/orderlyProvider";
import { useState, useEffect } from "react";
import { AppSocketProvider } from "./contexts/SocketContext";
import TranslationProvider from "./i18n/TranslationContext";
import "./styles/index.css";
import { withBasePath } from "./utils/base-path";
import { i18n } from "@orderly.network/i18n";
import { useApiInterceptor } from "@/hooks/useApiInterceptor";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [lang, setLang] = useState("en");

  // Use the API interceptor hook
  useApiInterceptor();

  // Handle initial language setup
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    console.log(`Language set from localStorage: ${savedLang}`);

    if (savedLang) {
      console.log(`Setting language to: ${savedLang}`);
      setLang(savedLang);
      i18n.changeLanguage(savedLang);
      localStorage.removeItem("lang");

      // Set CSS custom property for language
      document.documentElement.style.setProperty('--current-lang', savedLang);
      // Or set data attribute
      document.documentElement.setAttribute('data-lang', savedLang);
    } else {
      // Check if i18n has a saved language preference
      const currentLang = i18n.language === "ko" ? "ko" : "en";
      setLang(currentLang);
      console.log(`No language found in localStorage, using i18n default: ${currentLang}`);
      i18n.changeLanguage(currentLang);

      // Set CSS custom property for language
      document.documentElement.style.setProperty('--current-lang', currentLang);
      // Or set data attribute
      document.documentElement.setAttribute('data-lang', currentLang);
    }
  }, []);

  // Handle referral code from URL parameters and set the default referral code
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const refFromUrl = urlParams.get('ref');

    if (refFromUrl) {
      localStorage.setItem('referral_code', refFromUrl.trim());
      console.log(`Referral code from URL: ${refFromUrl}`);
    } else {
      const existingRef = localStorage.getItem('referral_code');
      if (!existingRef) {
        const defaultRef = import.meta.env.VITE_DEFAULT_REFERRAL_CODE?.trim();
        if (defaultRef) {
          localStorage.setItem('referral_code', defaultRef);
          console.log(`Set default referral code: ${defaultRef}`);
        }
      }
    }
  }, [location.pathname]);


  useEffect(() => {
    // Appending language button in header
    const desktopDivSelector = "body > div.oui-scaffold-root> div.oui-box > header > div:nth-child(2)";
    const mobileDivSelector = "body > div.oui-scaffold-root > header > div > div:nth-child(2)";
    const mobileDivSelector2 = "body > div.oui-box > header > div > div:nth-child(2)"

    function insertLocaleButton() {
      // Remove existing button first to prevent duplicates
      const existingButton = document.getElementById("changeLocaleButtonDiv");
      if (existingButton) {
        existingButton.remove();
      }

      const targetDiv = document.querySelector(desktopDivSelector) || document.querySelector(mobileDivSelector) || document.querySelector(mobileDivSelector2);
      if (targetDiv) {
        const newElem = document.createElement("div");
        newElem.style.cursor = "pointer";
        newElem.id = "changeLocaleButtonDiv";
        newElem.textContent = (lang === "en" ? "한국어" : "English");
        newElem.onclick = () => {
          const nextLang = lang === "en" ? "ko" : "en";
          localStorage.setItem("lang", nextLang);
          window.location.reload();
        };
        targetDiv.insertBefore(newElem, targetDiv.firstChild);
        return true;
      }
      return false;
    }

    // Enhanced retry logic with multiple attempts
    function tryFind(retryCount = 0) {
      const maxRetries = 10;
      if (insertLocaleButton()) {
        return;
      }

      if (retryCount < maxRetries) {
        const delay = Math.min(500 * Math.pow(1.5, retryCount), 3000); // Exponential backoff, max 3s
        setTimeout(() => tryFind(retryCount + 1), delay);
      } else {
        console.warn("Failed to insert language button after maximum retries");
      }
    }

    // Observe DOM changes to detect when new content is loaded
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if any new nodes contain our target elements
          const hasRelevantChanges = Array.from(mutation.addedNodes).some(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              return element.querySelector('.oui-scaffold-topNavbar') ||
                element.classList.contains('oui-scaffold-topNavbar') ||
                element.querySelector('header') ||
                element.tagName === 'HEADER';
            }
            return false;
          });

          if (hasRelevantChanges && !document.getElementById("changeLocaleButtonDiv")) {
            setTimeout(() => tryFind(), 100);
          }
        }
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initial insertion with multiple strategies

    // Strategy 1: Immediate attempt
    tryFind();

    // Strategy 2: Short delay for SPA navigation
    const quickTimeout = setTimeout(() => tryFind(), 100);

    // Strategy 3: Longer delay for slow loading
    const slowTimeout = setTimeout(() => tryFind(), 1000);

    window.addEventListener("resize", insertLocaleButton);

    function checkAndDisableOrderButton() {
      const targetDate = new Date('2025-07-21T18:00:00+09:00');
      const currentDate = new Date();

      const submitButton = document.getElementById('order-entry-submit-button');

      if (currentDate < targetDate) {
        // Set the CSS variable based on current language
        const tradingDisabledText = lang === "ko" ? "거래 비활성화" : "Trading Disabled";
        document.documentElement.style.setProperty('--trading-disabled-text', `"${tradingDisabledText}"`);

        if (submitButton) {
          submitButton.classList.add('orderly-disabled');
        }
      } else {
        if (submitButton) {
          submitButton.classList.remove('orderly-disabled');
        }
      }
    }

    const buttonCheckInterval = setInterval(checkAndDisableOrderButton, 2000);
    checkAndDisableOrderButton();

    return () => {
      window.removeEventListener("resize", insertLocaleButton);
      clearInterval(buttonCheckInterval);
      clearTimeout(quickTimeout);
      clearTimeout(slowTimeout);
      observer.disconnect();
    };
  }, [lang, location.pathname]); // This will re-run on every page navigation

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/webp" href={withBasePath("/favicon.webp")} />
        <Meta />
        <Links />
        {/* SEO: Dynamic title and meta tags */}
        <title>
          {lang === "ko"
            ? "DeFi: DEX 거래소 아덴"
            : "ADEN - DeFi Crypto Futures Trading Platform"}
        </title>
        <meta
          name="description"
          content={
            lang === "ko"
              ? "아덴 거래소(ADEN): 탈중앙화 거래소(DEX)에서 암호화폐 선물거래를 경험하세요. 아덴, 거래소, 덱스 거래소, DeFi, 암호화폐, 선물거래"
              : "Aden Exchange (ADEN): Experience DeFi crypto futures trading on a decentralized exchange (DEX). Aden, Exchange, DEX Exchange, DeFi, Crypto, Futures Trading"
          }
        />
        <meta
          name="keywords"
          content={
            lang === "ko"
              ? "아덴 거래소, 아덴, 탈중앙화 거래소, 거래소, 덱스 거래소, DEX, DeFi, 암호화폐, 선물거래"
              : "Aden Exchange, Aden, Decentralized Exchange, Exchange, DEX Exchange, DEX, DeFi, Crypto, Futures Trading"
          }
        />
        <meta property="og:title" content={lang === "ko" ? "DeFi: DEX 거래소 아덴" : "ADEN - DeFi Crypto Futures Trading Platform"} />
        <meta property="og:description" content={
          lang === "ko"
            ? "아덴 거래소(ADEN): 탈중앙화 거래소(DEX)에서 암호화폐 선물거래를 경험하세요."
            : "Aden Exchange (ADEN): Experience DeFi crypto futures trading on a decentralized exchange (DEX)."
        } />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aden.io/" />
        <meta property="og:image" content={withBasePath("/logo.svg")} />
      </head>
      <body>
        <TranslationProvider>
          <AppSocketProvider>
             <OrderlyProvider>
              {children}
             </OrderlyProvider>
          </AppSocketProvider>
        </TranslationProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}