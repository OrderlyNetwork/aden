import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import OrderlyProvider from "@/components/orderlyProvider";
import "./styles/index.css";
import { withBasePath } from "./utils/base-path";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/webp" href={withBasePath("/favicon.webp")} />
        <Meta />
        <Links />
        <title>ADEN - DeFi Crypto Futures Trading Platform</title>
        <meta
          name="description"
          content="Aden Exchange (ADEN): Experience DeFi crypto futures trading on a decentralized exchange (DEX). Aden, Exchange, DEX Exchange, DeFi, Crypto, Futures Trading"
        />
        <meta
          name="keywords"
          content="Aden Exchange, Aden, Decentralized Exchange, Exchange, DEX Exchange, DEX, DeFi, Crypto, Futures Trading"
        />
        <meta property="og:title" content="ADEN - DeFi Crypto Futures Trading Platform" />
        <meta property="og:description" content="Aden Exchange (ADEN): Experience DeFi crypto futures trading on a decentralized exchange (DEX)." />
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