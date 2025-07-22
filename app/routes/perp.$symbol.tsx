import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "@remix-run/react";
import { API } from "@orderly.network/types";
import { TradingPage } from "@orderly.network/trading";
import { updateSymbol } from "@/utils/storage";
import { useOrderlyConfig } from "@/utils/config";
import { useMarkPrice } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";

// Fee Section Modifier Component
function FeeSectionModifier() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.log('🔍 Setting up Fee section modification...');

    const modifyFeeSection = () => {
      // Remove existing fee section when language changes
      const existingNewSection = document.getElementById('new-fees-section');
      if (existingNewSection) {
        existingNewSection.remove();
      }

      // Find the fees section by looking for specific span elements
      const spans = document.querySelectorAll('span.oui-text-2xs');
      let feesSection = null;

      for (const span of spans) {
        const text = span.textContent?.trim() || '';
        // Check if this is the Fees span
        if (text === t('common.fees') || text.includes('MM')) {
          // Check if parent div also contains Taker and Maker spans
          const parentDiv = span.closest('div.oui-box');
          if (parentDiv) {
            const childSpans = parentDiv.querySelectorAll('span.oui-text-2xs');
            const hasTakerMaker = Array.from(childSpans).some(s =>
              (s.textContent?.includes(`${t('portfolio.feeTier.column.taker')}:`) ||
                s.textContent?.includes('Taker:') ||
                s.textContent?.includes('테이커:')) &&
              Array.from(childSpans).some(s2 =>
                s2.textContent?.includes(`${t('portfolio.feeTier.column.maker')}:`) ||
                s2.textContent?.includes('Maker:') ||
                s2.textContent?.includes('메이커:')
              )
            );

            if (hasTakerMaker) {
              feesSection = parentDiv;
              break;
            }
          }
        }
      }

      if (!feesSection) {
        console.log('⚠️ Fees section not found');
        return;
      }

      // Get the parent container
      const parentContainer = feesSection.parentElement;
      if (!parentContainer) {
        console.log('⚠️ Parent container not found');
        return;
      }

      // Change existing "Fees" to "MM Fees"
      const existingFeesSpan = feesSection.querySelector('span.oui-text-2xs');
      if (existingFeesSpan) {
        existingFeesSpan.textContent = `MM ${t('common.fees')}`;
      }

      // Create new fees section with the same structure
      const newFeesSection = document.createElement('div');
      newFeesSection.id = 'new-fees-section';
      newFeesSection.setAttribute('class', 'oui-box oui-flex oui-flex-row oui-items-center oui-justify-between oui-flex-nowrap');

      newFeesSection.innerHTML = `
        <span class="oui-text-2xs">${t('common.fees')}</span>
        <div class="oui-box oui-flex oui-flex-row oui-items-center oui-justify-start oui-flex-nowrap oui-gap-1">
          <span class="oui-text-2xs">${t('portfolio.feeTier.column.taker')}:</span>
          <span class="oui-text-2xs oui-text-base-contrast-80">0%</span>
          <span class="oui-text-2xs">/</span>
          <span class="oui-text-2xs">${t('portfolio.feeTier.column.maker')}:</span>
          <span class="oui-text-2xs oui-text-base-contrast-80">0%</span>
        </div>
      `;

      // Insert the new section before the existing one
      parentContainer.insertBefore(newFeesSection, feesSection);
    };

    // Monitor for changes
    const observer = new MutationObserver((mutations) => {
      const shouldProcess = mutations.some(mutation =>
        mutation.type === 'childList' ||
        mutation.type === 'attributes' ||
        mutation.type === 'characterData'  // Add this to catch text content changes
      );

      if (shouldProcess) {
        setTimeout(modifyFeeSection, 100);
      }
    });

    const config = {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true  // Add this to watch for text content changes
    };

    observer.observe(document.body, config);

    // Initial check
    modifyFeeSection();

    // Force update when language changes
    const handleLanguageChange = () => {
      modifyFeeSection();
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      observer.disconnect();
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [t, i18n]); // Add i18n to dependencies

  return null;
}

// Toast Sound Effect Component
function ToastSoundEffect() {
  useEffect(() => {
    console.log('🔊 Setting up toast sound effect...');

    // Create audio element with coin sound from public folder
    const audio = new Audio('/coin.mp3');
    audio.volume = 0.5; // Set volume to 50%

    // Messages that should trigger the sound
    const triggerMessages = [
      'Order filled',
      '주문 체결됨',
      'Approve success',
      '승인 성공',
      'Deposit requested',
      '입금 요청됨',
      'Deposit completed',
      '입금 완료됨',
      'Withdraw requested',
      '출금 요청됨',
      'Withdraw completed',
      '출금 완료됨',
    ];

    // Create observer to watch for toast elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Check for any toast element by role="status"
            const toastElement = node.querySelector('[role="status"]');
            if (toastElement) {
              // Check if the toast contains any of the trigger messages
              const toastText = toastElement.textContent || '';
              const shouldPlaySound = triggerMessages.some(msg => toastText.includes(msg));

              if (shouldPlaySound) {
                audio.currentTime = 0; // Reset audio to start
                audio.play().catch(err => console.log('Audio play failed:', err));
              }
            }
          }
        });
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup
    return () => {
      observer.disconnect();
      audio.pause();
      audio.src = '';
    };
  }, []);

  return null;
}

// Order History Table Header Modifier Component
function OrderHistoryHeaderModifier() {
  const { i18n } = useTranslation();

  useEffect(() => {
    console.log('🔍 Setting up Order History header modification...');

    const getFeeText = (isMMFee: boolean) => {
      const isKorean = i18n.language === 'ko';
      if (isMMFee) {
        return isKorean ? 'MM 수수료' : 'MM fee';
      }
      return isKorean ? '수수료' : 'Fee';
    };

    const modifyFeeHeader = () => {
      // Check if order history tab is selected
      const orderHistoryTab = document.querySelector('[data-testid="oui-testid-dataList-orderHistory-tab"]');
      const isOrderHistoryActive = orderHistoryTab?.classList.contains('active') ||
        orderHistoryTab?.getAttribute('aria-selected') === 'true' ||
        orderHistoryTab?.classList.contains('selected');

      if (!isOrderHistoryActive) {
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
          const headerText = headerDiv.textContent?.trim();
          if (headerText === 'Fee' || headerText === '수수료') {
            headerDiv.textContent = getFeeText(true); // Convert to MM fee
            mmFeeHeader = header;
            mmFeeIndex = index;
            mmFeeStyle = (header as HTMLElement).style.cssText || 'width: 124px;';
            header.setAttribute('data-header-type', 'mm-fee');
          } else if (headerText === 'MM fee' || headerText === 'MM 수수료') {
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
          newFeeTh.innerHTML = `<div class="oui-inline-flex oui-items-center oui-gap-x-1">${getFeeText(false)}</div>`;

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
  }, [i18n.language]); // Add i18n.language as a dependency

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
      {/* Fee Section Modifier */}
      <FeeSectionModifier />
      <ToastSoundEffect />
    </>
  );
}
