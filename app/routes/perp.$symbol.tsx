import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "@remix-run/react";
import { API } from "@orderly.network/types";
import { TradingPage } from "@orderly.network/trading";
import { updateSymbol } from "@/utils/storage";
import { useOrderlyConfig } from "@/utils/config";
import {
  useMarkets, useMarketsStore,
  MarketsStorageKey,
  MarketsType,
  useMarkPrice
} from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import { TradingPageModifiers } from '@/components/trading/TradingPageModifiers';


export default function PerpPage() {
  const params = useParams();
  const [symbol, setSymbol] = useState(params.symbol!);
  const config = useOrderlyConfig();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: price } = useMarkPrice(symbol);
  const { i18n } = useTranslation();

  const [markets, { favorites, updateFavorites }] = useMarkets(MarketsType.FAVORITES);
  useEffect(() => {
    const bgscSymbol = "PERP_BGSC_USDC";
    const defaultTab = { name: "Popular", id: 1 };
    if (!favorites.some(fav => fav.name === bgscSymbol)) {
      updateFavorites([{ name: bgscSymbol, tabs: [defaultTab] }, ...favorites]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    updateSymbol(symbol);
  }, [symbol]);

  useEffect(() => {
    if (price && typeof price === 'number') {
      const formattedSymbol = symbol.split("_")[1];
      const formattedPrice = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 20,
        maximumSignificantDigits: 5,
      }).format(price);

      const platformName = i18n.language === 'ko' ? '아덴 거래소' : 'ADEN Dex';
      document.title = `${formattedPrice} ${formattedSymbol} | ${platformName}`;
    }
  }, [price, symbol, i18n.language]);

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const symbol = data.symbol;
      setSymbol(symbol);

      const searchParamsString = searchParams.toString();
      const queryString = searchParamsString ? `?${searchParamsString}` : '';

      navigate(`/perp/${symbol}${queryString}`);
    },
    [navigate, searchParams]
  );

  return (
    <>
      <TradingPage
        symbol={symbol}
        onSymbolChange={onSymbolChange}
        tradingViewConfig={config.tradingPage.tradingViewConfig}
        sharePnLConfig={config.tradingPage.sharePnLConfig}
      />
      <TradingPageModifiers />
      {/* Move BGSC to top of table after render */}
      <ScriptMoveBGSCToTop />
    </>
  );
}


// This component injects a useEffect to move BGSC row to the top of the table
function ScriptMoveBGSCToTop() {
  useEffect(() => {
    const interval = setInterval(() => {
      const tbodys = Array.from(document.querySelectorAll('tbody'));
      let found = false;
      tbodys.forEach((tbody, idx) => {
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const bgscRow = rows.find(row => row.textContent && row.textContent.includes('BGSC'));
        if (bgscRow) {
          found = true;
          if (tbody.firstChild !== bgscRow) {
            tbody.insertBefore(bgscRow, tbody.firstChild);
            // console.log(`Moved BGSC row in tbody #${idx}`);
          }
        }
      });
      // if (!found) {
      //   console.log('No BGSC row found in any tbody');
      // }
    }, 1300);
    return () => clearInterval(interval);
  }, []);
  return null;
}
