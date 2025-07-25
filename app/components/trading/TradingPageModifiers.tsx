import { FeeSectionModifier } from './FeeSectionModifier';
import { OrderHistoryHeaderModifier } from './OrderHistoryHeaderModifier';
import { useToastSoundEffect } from '@/hooks/useToastSoundEffect';

/**
 * Wrapper component that applies all trading page modifications and effects
 * This includes fee section modifications, order history header changes, and sound effects
 */
export function TradingPageModifiers() {
    // Apply toast sound effects
    useToastSoundEffect();

    return (
        <>
            <FeeSectionModifier />
            <OrderHistoryHeaderModifier />
        </>
    );
} 