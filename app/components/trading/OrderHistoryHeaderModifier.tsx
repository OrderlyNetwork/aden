import { useCallback } from 'react';
import { useTranslation } from "@orderly.network/i18n";
import { usePollingEffect } from "@/hooks/usePollingEffect";

/**
 * Component that modifies the order history table headers
 * Adds a regular "Fee" column alongside the existing "MM fee" column
 */
export function OrderHistoryHeaderModifier() {
    const { i18n } = useTranslation();

    const getFeeText = useCallback((isMMFee: boolean) => {
        const isKorean = i18n.language === 'ko';
        return isMMFee ? (isKorean ? 'MM 수수료' : 'MM fee') : (isKorean ? '수수료' : 'Fee');
    }, [i18n.language]);

    usePollingEffect(() => {
        // Check if order history tab is selected
        const orderHistoryTab = document.querySelector('[data-testid="oui-testid-dataList-orderHistory-tab"]');
        const isOrderHistoryActive = orderHistoryTab?.classList.contains('active') ||
            orderHistoryTab?.getAttribute('aria-selected') === 'true' ||
            orderHistoryTab?.classList.contains('selected');

        if (!isOrderHistoryActive) return;

        // Find the table container
        const tableContainer = document.querySelector('.oui-table-root');
        if (!tableContainer || tableContainer.getAttribute('data-fee-headers-processed') === 'true') return;

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
                    headerDiv.textContent = getFeeText(true);
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

        if (!mmFeeStyle.includes('width')) return;

        // Check if Fee header already exists
        if (mmFeeHeader && !tableContainer.querySelector('th[data-header-type="fee"]') && mmFeeIndex !== -1) {
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
                }
            }
        }

        // Mark as processed
        tableContainer.setAttribute('data-fee-headers-processed', 'true');
    }, [getFeeText]);

    return null;
} 