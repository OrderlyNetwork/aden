import { useEffect } from 'react';
import { withBasePath } from '@/utils/base-path';

/**
 * Custom hook that plays sound effects when specific toast messages appear
 */
export function useToastSoundEffect() {
    useEffect(() => {
        // Create audio element with coin sound from public folder
        const audioPath = withBasePath("/Coin.mp3");
        const audio = new Audio(audioPath);
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

        // Find toast container or wait for it
        const findAndObserveToaster = () => {
            const toastContainer = document.getElementById('_rht_toaster');
            if (toastContainer) {
                // Start observing the toast container
                observer.observe(toastContainer, {
                    childList: true,
                    subtree: true
                });
            } else {
                // If container not found, retry after a short delay
                setTimeout(findAndObserveToaster, 500);
            }
        };

        findAndObserveToaster();

        // Cleanup
        return () => {
            observer.disconnect();
            audio.pause();
            audio.src = '';
        };
    }, []);
} 