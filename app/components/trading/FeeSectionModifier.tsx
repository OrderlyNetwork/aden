import { useTranslation } from "@orderly.network/i18n";
import { usePollingEffect } from "@/hooks/usePollingEffect";

/**
 * Component that modifies the fee section in the trading interface
 * Adds a regular "Fees" section alongside the existing "MM Fees" section
 */
export function FeeSectionModifier() {
    const { t } = useTranslation();

    usePollingEffect(() => {
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

        if (!feesSection) return;

        // Get the parent container
        const parentContainer = feesSection.parentElement;
        if (!parentContainer) return;

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
    }, [t]);

    return null;
} 