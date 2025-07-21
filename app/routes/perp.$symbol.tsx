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

      // Check if table is already processed
      if (tableContainer.getAttribute('data-fee-headers-processed') === 'true') {
        return;
      }

      // Find table headers
      const tableHeaders = tableContainer.querySelectorAll('thead tr th');
      let mmFeeHeader: Element | null = null;
      let mmFeeIndex = -1;
      let mmFeeStyle: string = '';

      // First pass: find MM fee header and capture its style
      tableHeaders.forEach((header, index) => {
        const headerDiv = header.querySelector('.oui-inline-flex.oui-items-center.oui-gap-x-1');
        if (headerDiv) {
          if (headerDiv.textContent?.trim() === 'Fee') {
            headerDiv.textContent = 'MM fee';
            mmFeeHeader = header;
            mmFeeIndex = index;
            mmFeeStyle = (header as HTMLElement).style.cssText || 'width: 124px;';
            header.setAttribute('data-header-type', 'mm-fee');
          } else if (headerDiv.textContent?.trim() === 'MM fee') {
            mmFeeHeader = header;
            mmFeeIndex = index;
            mmFeeStyle = (header as HTMLElement).style.cssText || 'width: 124px;';
            header.setAttribute('data-header-type', 'mm-fee');
          }
        }
      });

      // Wait for styles to be applied if they're not present
      if (!mmFeeStyle.includes('width')) {
        console.log('⚠️ Waiting for styles to be applied...');
        return; // Will retry on next mutation
      }

      // Check if Fee header already exists using data attribute
      const feeHeaderExists = tableContainer.querySelector('th[data-header-type="fee"]') !== null;

      // If MM fee header found and Fee header doesn't exist yet, add new Fee header
      if (mmFeeHeader && !feeHeaderExists && mmFeeIndex !== -1) {
        const headerRow = tableContainer.querySelector('thead tr');
        if (headerRow) {
          // Create new Fee header with same styling
          const newFeeTh = document.createElement('th');
          newFeeTh.className = mmFeeHeader.className;
          newFeeTh.setAttribute('data-header-type', 'fee');
          newFeeTh.style.cssText = mmFeeStyle;
          newFeeTh.innerHTML = `<div class="oui-inline-flex oui-items-center oui-gap-x-1">Fee</div>`;

          // Insert before MM fee
          headerRow.insertBefore(newFeeTh, mmFeeHeader);
          console.log('➕ Added new Fee header before MM fee');

          // Add corresponding empty cells to each row in tbody
          const tbody = tableContainer.querySelector('tbody');
          if (tbody) {
            const existingCell = tbody.querySelector(`td:nth-child(${mmFeeIndex + 1})`);
            const cellStyle = existingCell ? (existingCell as HTMLElement).style.cssText : mmFeeStyle;

            tbody.querySelectorAll('tr').forEach(row => {
              const newCell = document.createElement('td');
              newCell.className = row.children[mmFeeIndex]?.className || '';
              newCell.setAttribute('data-cell-type', 'fee');
              newCell.style.cssText = cellStyle;
              newCell.innerHTML = `
                <span data-accent-color="inherit" class="oui-text-inherit oui-tabular-nums">0</span>
                <div class="oui-absolute oui-left-0 oui-top-0 oui-z-[-1] oui-size-full group-hover:oui-bg-line-4"></div>
              `;
              row.insertBefore(newCell, row.children[mmFeeIndex]);
            });
            console.log('➕ Added corresponding cells in table rows');
          }

          // Mark table as processed
          tableContainer.setAttribute('data-fee-headers-processed', 'true');
        }
      } else if (mmFeeHeader) {
        // If we found MM fee header but didn't need to add Fee header, still mark as processed
        tableContainer.setAttribute('data-fee-headers-processed', 'true');
      }
    };

    // Monitor for order history tab selection and table changes
    const setupHeaderModification = () => {
      modifyFeeHeader();

      const observer = new MutationObserver((mutations) => {
        // Only process if the table structure might have changed
        const shouldProcess = mutations.some(mutation =>
          mutation.type === 'childList' ||
          (mutation.type === 'attributes' &&
            (mutation.attributeName === 'data-fee-headers-processed' ||
              mutation.attributeName === 'style') &&
            mutation.target instanceof Element &&
            (!mutation.target.hasAttribute('data-fee-headers-processed') ||
              mutation.attributeName === 'style'))
        );

        if (shouldProcess) {
          setTimeout(modifyFeeHeader, 100);
        }
      });

      const tradingPageContainer = document.body;
      observer.observe(tradingPageContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'aria-selected', 'data-testid', 'data-fee-headers-processed', 'style']
      });

      return () => observer.disconnect();
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
