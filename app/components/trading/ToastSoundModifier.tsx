import { useEffect } from 'react';
import { withBasePath } from '@/utils/base-path';
import { usePollingEffect } from '@/hooks/usePollingEffect';

/**
 * Component that handles toast sound effects and adds a sound toggle UI element
 * This component both plays sounds and adds a toggle switch to control sound on/off
 */
export function ToastSoundModifier() {

    // Add sound toggle UI element
    usePollingEffect(() => {
        // Check if toggle already exists
        if (document.getElementById('aden-sound-toggle')) return;

        // Find the exact "Reduce only" button element using the testid
        const reduceOnlyButton = document.querySelector('[data-testid="oui-testid-orderEntry-reduceOnly-switch"]');
        if (!reduceOnlyButton) return;

        // Get the outer container (button -> inner div -> outer div)
        const reduceOnlyContainer = reduceOnlyButton.parentElement?.parentElement;
        if (!reduceOnlyContainer) return;

        // Find the parent of the container to insert after it
        const parentContainer = reduceOnlyContainer.parentElement;
        if (!parentContainer) return;

        // Create the sound toggle container with same structure
        const soundToggleContainer = document.createElement('div');
        soundToggleContainer.className = 'oui-box oui-flex oui-flex-row oui-items-center oui-justify-between oui-flex-nowrap !oui-mt-0 xl:!oui-mt-3';

        soundToggleContainer.innerHTML = `
      <div class="oui-box oui-flex oui-flex-row oui-items-center oui-justify-start oui-flex-nowrap oui-gap-x-1">
        <button 
          type="button" 
          role="switch" 
          aria-checked="true" 
          data-state="checked" 
          value="on" 
          class="peer oui-inline-flex oui-w-[28px] oui-shrink-0 oui-cursor-pointer oui-items-center oui-rounded-full oui-border-transparent oui-shadow-sm oui-transition-colors focus-visible:oui-outline-none focus-visible:oui-ring-2 focus-visible:oui-ring-ring focus-visible:oui-ring-offset-2 focus-visible:oui-ring-offset-background disabled:oui-cursor-not-allowed disabled:oui-opacity-50 data-[state=checked]:oui-bg-primary-darken data-[state=unchecked]:oui-bg-base-1 oui-h-[14px]"
          id="aden-sound-toggle"
        >
          <span 
            data-state="checked" 
            class="oui-pointer-events-none oui-block oui-h-[10px] oui-w-[10px] oui-rounded-full oui-bg-white/80 oui-shadow-lg oui-ring-0 oui-transition-transform data-[state=checked]:oui-translate-x-[15px] data-[state=unchecked]:oui-translate-x-[3px]"
          ></span>
        </button>
        <label for="aden-sound-toggle" class="oui-text-xs">Sound alerts</label>
      </div>
    `;

        // Insert after the reduce only container
        const nextSibling = reduceOnlyContainer.nextSibling;
        if (nextSibling) {
            parentContainer.insertBefore(soundToggleContainer, nextSibling);
            console.log('inserted');
        } else {
            parentContainer.appendChild(soundToggleContainer);
            console.log('appended');
        }

        // Add click handler to toggle sound
        const toggleButton = soundToggleContainer.querySelector('#aden-sound-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                const currentState = toggleButton.getAttribute('data-state');
                const newState = currentState === 'checked' ? 'unchecked' : 'checked';
                const newChecked = newState === 'checked';

                // Update button attributes
                toggleButton.setAttribute('aria-checked', newChecked.toString());
                toggleButton.setAttribute('data-state', newState);

                // Update span state
                const span = toggleButton.querySelector('span');
                if (span) {
                    span.setAttribute('data-state', newState);
                }
            });
        }
    }, []);

    // Handle toast sound effects
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
                            // Double-check sound is still enabled before playing
                            const currentSoundToggle = document.getElementById('aden-sound-toggle');
                            const isCurrentlySoundEnabled = currentSoundToggle?.getAttribute('data-state') === 'checked';

                            if (!isCurrentlySoundEnabled) return;

                            // Check if the toast contains any of the trigger messages
                            const toastText = toastElement.textContent || '';
                            const shouldPlaySound = triggerMessages.some(msg => toastText.includes(msg));

                            if (shouldPlaySound) {
                                audio.currentTime = 0; // Reset audio to start
                                audio.play().catch(err => console.log('Audio play failed:', err));

                                // TODO: Add any UI modifications here
                                // Example: Add special styling to successful toast messages
                                // toastElement.classList.add('success-toast-animation');
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

        // Store cleanup function
        return () => {
            observer.disconnect();
            audio.pause();
            audio.src = '';
        };
    }, []);

    return null;
} 