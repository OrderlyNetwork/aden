import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "@remix-run/react";
import { API } from "@orderly.network/types";
import { TradingPage } from "@orderly.network/trading";
import { updateSymbol } from "@/utils/storage";
import { useOrderlyConfig } from "@/utils/config";
import { useMarkPrice } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";

// Order History Table Header Modifier Component
function OrderHistoryHeaderModifier() {
  useEffect(() => {
    console.log('🔍 Setting up Order History header modification...');

    const modifyFeeHeader = () => {
      // Check if order history tab is selected
      const orderHistoryTab = document.querySelector('[data-testid="oui-testid-dataList-orderHistory-tab"]');
      const isOrderHistoryActive = orderHistoryTab?.classList.contains('active') ||
        orderHistoryTab?.getAttribute('aria-selected') === 'true' ||
        orderHistoryTab?.classList.contains('selected');

      if (!isOrderHistoryActive) {
        console.log('⚠️ Order history tab not active');
        return;
      }

      // Find the table container
      const tableContainer = document.querySelector('.oui-table-root');
      if (!tableContainer) {
        console.log('⚠️ Table container (.oui-table-root) not found');
        return;
      }

      // Find table headers
      const tableHeaders = tableContainer.querySelectorAll('thead tr th');

      tableHeaders.forEach((header) => {
        // Look for the div containing "Fee" text
        const headerDiv = header.querySelector('.oui-inline-flex.oui-items-center.oui-gap-x-1');

        if (headerDiv && headerDiv.textContent?.trim() === 'Fee') {
          console.log('🎯 Found Fee header, changing to MM fee');
          headerDiv.textContent = 'MM fee';

          // Mark as modified to avoid repeated changes
          header.setAttribute('data-header-modified', 'true');
        }
      });
    };

    // Monitor for order history tab selection and table changes
    const setupHeaderModification = () => {
      // Initial modification
      modifyFeeHeader();

      // Observer for tab changes and table updates
      const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;

        mutations.forEach((mutation) => {
          // Check if order history tab state changed
          if (mutation.target &&
            (mutation.target as Element).getAttribute?.('data-testid') === 'oui-testid-dataList-orderHistory-tab') {
            shouldCheck = true;
          }

          // Check if table content changed
          if (mutation.target &&
            ((mutation.target as Element).classList?.contains('oui-table-root') ||
              (mutation.target as Element).closest?.('.oui-table-root'))) {
            shouldCheck = true;
          }

          // Check if any table headers were added/modified
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE &&
                ((node as Element).tagName === 'TH' ||
                  (node as Element).querySelector?.('th'))) {
                shouldCheck = true;
              }
            });
          }
        });

        if (shouldCheck) {
          console.log('🔄 Table or tab changed, checking for Fee header...');
          setTimeout(modifyFeeHeader, 100); // Small delay to ensure DOM is updated
        }
      });

      // Watch for changes in the entire trading page
      const tradingPageContainer = document.body;
      observer.observe(tradingPageContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'aria-selected', 'data-testid']
      });

      console.log('✅ Order history header modification observer setup complete');

      return () => {
        observer.disconnect();
        console.log('🛑 Order history header modification observer cleanup');
      };
    };

    // Setup with delay to ensure TradingPage is loaded
    const setupTimeout = setTimeout(() => {
      const cleanup = setupHeaderModification();
      return cleanup;
    }, 2000);

    return () => {
      clearTimeout(setupTimeout);
    };
  }, []);

  return null;
}

export default function PerpPage() {
  const params = useParams();
  const [symbol, setSymbol] = useState(params.symbol!);
  const config = useOrderlyConfig();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: price } = useMarkPrice(symbol);
  const { i18n } = useTranslation();

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
      {/* Order History Header Modifier */}
      <OrderHistoryHeaderModifier />
    </>
  );
}
