import { useEffect } from 'react';

/**
 * Custom hook that runs a callback function initially and then at regular intervals
 * @param callback - Function to execute on each poll
 * @param dependencies - Dependencies array to control when polling restarts
 * @param interval - Polling interval in milliseconds (default: 2000)
 */
export function usePollingEffect(
    callback: () => void,
    dependencies: any[] = [],
    interval: number = 2000
) {
    useEffect(() => {
        // Initial call
        callback();

        // Set up polling
        const intervalId = setInterval(callback, interval);

        return () => clearInterval(intervalId);
    }, dependencies);
} 