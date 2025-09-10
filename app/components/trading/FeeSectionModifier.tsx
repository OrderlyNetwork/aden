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

        // 保证 parentContainer 是纵向排列
        parentContainer.style.flexDirection = 'column';

        // Create new fees section with the same structure
        const newFeesSection = document.createElement('div');
        newFeesSection.id = 'new-fees-section';

        newFeesSection.setAttribute('class', 'oui-box oui-flex oui-flex-row oui-items-center oui-justify-between oui-flex-nowrap');
        newFeesSection.setAttribute('style', `
            font-size: 15.5px;
            -webkit-text-size-adjust: 100%;
            tab-size: 4;
            font-feature-settings: normal;
            font-variation-settings: normal;
            -webkit-tap-highlight-color: transparent;
            --oui-font-family: 'IBM Plex Sans', sans-serif;
            --trading-disabled-text: "Trading Disabled";
            --oui-color-primary: 255 186 0;
            --oui-color-primary-light: 255 204 51;
            --oui-color-primary-darken: 204 149 0;
            --oui-color-primary-contrast: 0 0 0;
            --oui-color-link: 255 186 0;
            --oui-color-link-light: 255 204 51;
            --oui-color-secondary: 255 255 255;
            --oui-color-tertiary: 136 141 153;
            --oui-color-quaternary: 94 99 108;
            --oui-color-danger: 234 57 67;
            --oui-color-danger-light: 255 102 102;
            --oui-color-danger-darken: 239 69 74;
            --oui-color-danger-contrast: 255 255 255;
            --oui-color-success: 22 163 74;
            --oui-color-success-light: 72 187 120;
            --oui-color-success-darken: 32 178 108;
            --oui-color-success-contrast: 255 255 255;
            --oui-color-warning: 255 159 67;
            --oui-color-warning-light: 255 183 111;
            --oui-color-warning-darken: 230 130 50;
            --oui-color-warning-contrast: 255 255 255;
            --oui-color-fill: 24 26 32;
            --oui-color-fill-active: 34 36 44;
            --oui-color-base-1: 44 48 58;
            --oui-color-base-2: 38 41 50;
            --oui-color-base-3: 32 34 42;
            --oui-color-base-4: 69 64 94;
            --oui-color-base-5: 24 26 32;
            --oui-color-base-6: 20 22 28;
            --oui-color-base-7: 67 70 81;
            --oui-color-base-8: 12 14 20;
            --oui-color-base-9: 8 10 16;
            --oui-color-base-10: 4 6 12;
            --oui-color-base-foreground: 255 255 255;
            --oui-color-line: 93 83 123;
            --oui-color-trading-loss: 251 65 74;
            --oui-color-trading-loss-contrast: 255 255 255;
            --oui-color-trading-profit: 29 195 90;
            --oui-color-trading-profit-contrast: 255 255 255;
            --oui-gradient-primary-start: 204 149 0;
            --oui-gradient-primary-end: 255 204 51;
            --oui-gradient-secondary-start: 44 48 58;
            --oui-gradient-secondary-end: 24 26 32;
            --oui-gradient-success-start: 20 140 60;
            --oui-gradient-success-end: 22 163 74;
            --oui-gradient-danger-start: 200 50 60;
            --oui-gradient-danger-end: 234 57 67;
            --oui-gradient-brand-start: 255 186 0;
            --oui-gradient-brand-end: 255 159 67;
            --oui-gradient-brand-stop-start: 6.62%;
            --oui-gradient-brand-stop-end: 86.5%;
            --oui-gradient-brand-angle: 17.44deg;
            --oui-gradient-warning-start: 230 130 50;
            --oui-gradient-warning-end: 255 159 67;
            --oui-gradient-neutral-start: 24 26 32;
            --oui-gradient-neutral-end: 34 36 44;
            --oui-rounded-sm: 2px;
            --oui-rounded: 4px;
            --oui-rounded-md: 6px;
            --oui-rounded-lg: 8px;
            --oui-rounded-xl: 12px;
            --oui-rounded-2xl: 16px;
            --oui-rounded-full: 9999px;
            --oui-spacing-xs: 20rem;
            --oui-spacing-sm: 22.5rem;
            --oui-spacing-md: 26.25rem;
            --oui-spacing-lg: 30rem;
            --oui-spacing-xl: 33.75rem;
            --current-lang: en;
            --w3o-background-color: #1b112c;
            --w3o-foreground-color: #28183e;
            --w3o-text-color: #ffffff;
            --w3o-border-color: #3a2b50;
            --w3o-action-color: #b084e9;
            --w3o-border-radius: 16px;
            --w3o-font-family: Atyp Text, sans-serif;
            line-height: inherit;
            --onboard-modal-z-index: 88;
            font-weight: 600;
            --oui-height: 100%;
            --w-split-bar-shadow: #d5d5d5;
            --w-split-bar-shadow-disable: #d5d5d5;
            --tw-bg-opacity: 1;
            color: rgb(var(--oui-color-base-foreground)/.54);
            --tw-space-y-reverse: 0;
            border: 0 solid #e5e7eb;
            --tw-border-spacing-x: 0;
            --tw-border-spacing-y: 0;
            --tw-translate-x: 0;
            --tw-translate-y: 0;
            --tw-rotate: 0;
            --tw-skew-x: 0;
            --tw-skew-y: 0;
            --tw-scale-x: 1;
            --tw-scale-y: 1;
            --tw-pan-x: ;
            --tw-pan-y: ;
            --tw-pinch-zoom: ;
            --tw-scroll-snap-strictness: proximity;
            --tw-gradient-from-position: ;
            --tw-gradient-via-position: ;
            --tw-gradient-to-position: ;
            --tw-ordinal: ;
            --tw-slashed-zero: ;
            --tw-numeric-figure: ;
            --tw-numeric-spacing: ;
            --tw-numeric-fraction: ;
            --tw-ring-inset: ;
            --tw-ring-offset-width: 0px;
            --tw-ring-offset-color: #fff;
            --tw-ring-color: rgb(59 130 246 / 0.5);
            --tw-ring-offset-shadow: 0 0 #0000;
            --tw-ring-shadow: 0 0 #0000;
            --tw-shadow: 0 0 #0000;
            --tw-shadow-colored: 0 0 #0000;
            --tw-blur: ;
            --tw-brightness: ;
            --tw-contrast: ;
            --tw-grayscale: ;
            --tw-hue-rotate: ;
            --tw-invert: ;
            --tw-saturate: ;
            --tw-sepia: ;
            --tw-drop-shadow: ;
            --tw-backdrop-blur: ;
            --tw-backdrop-brightness: ;
            --tw-backdrop-contrast: ;
            --tw-backdrop-grayscale: ;
            --tw-backdrop-hue-rotate: ;
            --tw-backdrop-invert: ;
            --tw-backdrop-opacity: ;
            --tw-backdrop-saturate: ;
            --tw-backdrop-sepia: ;
            --tw-contain-size: ;
            --tw-contain-layout: ;
            --tw-contain-paint: ;
            --tw-contain-style: ;
            box-sizing: border-box;
            border-width: 0;
            border-style: solid;
            border-color: #e5e7eb;
            font-family: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
            width: var(--oui-width,unset);
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: space-between;
            --oui-width: 100%;
        `);

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