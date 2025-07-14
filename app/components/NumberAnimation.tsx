import { useEffect, useState } from 'react';

interface NumberAnimationProps {
    value: number;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export default function NumberAnimation({ 
    value, 
    duration = 1000, 
    decimals = 0,
    prefix = '',
    suffix = '',
    className = ''
}: NumberAnimationProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (value === displayValue || isAnimating) return;

        setIsAnimating(true);
        const startValue = displayValue;
        const endValue = value;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const currentValue = startValue + (endValue - startValue) * easeProgress;
            setDisplayValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(endValue);
                setIsAnimating(false);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration, displayValue, isAnimating]);

    const formatNumber = (num: number) => {
        // decimals 값을 안전한 범위(0-2)로 제한
        const safeDecimals = Math.max(0, Math.min(decimals || 0, 2));
        
        const options: Intl.NumberFormatOptions = {
            minimumFractionDigits: safeDecimals,
            maximumFractionDigits: safeDecimals,
            useGrouping: true
        };
        return num.toLocaleString('en-US', options);
    };

    return (
        <span className={`dc-inline-block dc-transition-colors dc-duration-200 ${className}`}>
            {prefix}{formatNumber(displayValue)}{suffix}
        </span>
    );
}