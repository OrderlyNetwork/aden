import { FeeSectionModifier } from './FeeSectionModifier';
import { OrderHistoryHeaderModifier } from './OrderHistoryHeaderModifier';
import { ToastSoundModifier } from './ToastSoundModifier';

/**
 * Wrapper component that applies all trading page modifications and effects
 * This includes fee section modifications, order history header changes, and sound effects
 */
export function TradingPageModifiers() {
    return (
        <>
            <FeeSectionModifier />
            <OrderHistoryHeaderModifier />
            <ToastSoundModifier />
        </>
    );
} 