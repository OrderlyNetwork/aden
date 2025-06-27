import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import OrderlyProvider from "@/components/orderlyProvider";
import { useState, useEffect } from "react";
import "./styles/index.css";
import { withBasePath } from "./utils/base-path";
import { i18n } from "@orderly.network/i18n";
import { useStorageChain } from "@orderly.network/hooks";

export function Layout({ children }: { children: React.ReactNode }) {
  const { setStorageChain } = useStorageChain();
  const defaultChainId = Number(import.meta.env.VITE_DEFAULT_CHAIN_ID);
  const getInitialLang = () => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("lang");
      if (savedLang) return savedLang;
    }
    return i18n.language === "ko" ? "ko" : "en";
  };

  const [lang, setLang] = useState(getInitialLang());

  useEffect(() => {


    setStorageChain(defaultChainId);

    // Appending language button in header
    const desktopDivSelector = "body > div.oui-scaffold-root.oui-font-semibold.oui-bg-base-10.oui-text-base-contrast.oui-flex.oui-flex-col.oui-custom-scrollbar.oui-overflow-auto > div.oui-box.oui-scaffold-topNavbar.oui-bg-base-9 > header > div.oui-box.oui-flex.oui-flex-row.oui-items-center.oui-justify-start.oui-flex-nowrap.oui-gap-2";
    const mobileDivSelector = "body > div.oui-scaffold-root.oui-w-full.oui-overflow-hidden.oui-bg-base-10 > header > div > div.oui-box.oui-flex.oui-flex-row.oui-items-center.oui-justify-start.oui-flex-nowrap.oui-gap-x-2";


    function insertLocaleButton() {
      const targetDiv = document.querySelector(desktopDivSelector) || document.querySelector(mobileDivSelector);
      if (targetDiv && !document.getElementById("changeLocaleButtonDiv")) {
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
      }
    }

    // Initial insert
    function tryFind() {
      const targetDiv = document.querySelector(desktopDivSelector) || document.querySelector(mobileDivSelector);
      if (targetDiv) {
        insertLocaleButton();
      } else {
        setTimeout(tryFind, 500);
      }
    }
    tryFind();

    window.addEventListener("resize", insertLocaleButton);

    // set the language
    const savedLang = localStorage.getItem("lang");
    console.log(`Language set from localStorage: ${savedLang}`);
    // If a language is saved in localStorage, use it; otherwise default to "en"
    if (savedLang) {
      setLang(savedLang);
      i18n.changeLanguage(savedLang);
      localStorage.removeItem("lang");
    } else {
      setLang("en");
      i18n.changeLanguage("en");
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", insertLocaleButton);
    };
  }, []);

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
        <meta property="og:image" content={withBasePath("/logo.webp")} />
      </head>
      <body>
        <OrderlyProvider>
          {children}
        </OrderlyProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}