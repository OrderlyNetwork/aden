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
import "./styles/index.css";
import { withBasePath } from "./utils/base-path";
import { i18n } from "@orderly.network/i18n";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [lang, setLang] = useState("en");

  // Handle initial language setup (now includes IP-based region check)
  useEffect(() => {
    let cancelled = false;

    const applyLang = (lng: "en" | "ko") => {
      if (cancelled) return;
      setLang(lng);
      i18n.changeLanguage(lng);
      document.documentElement.style.setProperty("--current-lang", lng);
      document.documentElement.setAttribute("data-lang", lng);
    };

    (async () => {
      const savedLang = localStorage.getItem("lang");
      if (savedLang === "en" || savedLang === "ko") {
        applyLang(savedLang as "en" | "ko");
        localStorage.removeItem("lang");
        return;
      }

      try {
        const resp = await fetch("https://api.orderly.org/v1/ip_info");
        if (resp.ok) {
          const data = await resp.json();
          const region = (data?.data?.region || "")
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "");
          console.log("Detected region:", region);
          const isKorean = ["korea", "southkorea", "republicofkorea", "kr"].includes(region);
          if (isKorean) {
            applyLang("ko");
            return;
          }
        }
      } catch {
        // ignore network errors, fall through to i18n default
      }

      // Fallback to current i18n language (defaults to en)
      applyLang(i18n.language === "ko" ? "ko" : "en");
    })();

    return () => {
      cancelled = true;
    };
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