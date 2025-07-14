import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface AlertProps {
    message: string;
    isOpen: boolean;
    onClose: () => void;
    autoCloseDelay?: number;
}

export default function Alert({ message, isOpen, onClose, autoCloseDelay = 2000 }: AlertProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);

            return () => {
                clearTimeout(timer);
                document.body.style.overflow = 'auto';
            };
        }
    }, [isOpen, onClose, autoCloseDelay]);

    if (!isOpen || !mounted) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const modalContent = (
        <div 
            className="dc-fixed dc-inset-0 dc-z-[999999] dc-flex dc-items-center dc-justify-center dc-w-full dc-min-h-screen dc-bg-black/30"
            onClick={handleBackdropClick}
            style={{
                backdropFilter: 'blur(8px)',
                isolation: 'isolate',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }}
        >
            <div className="animate-fadeIn dc-w-full dc-max-w-md dc-z-[9999999]">
                <div 
                    className="dc-relative dc-p-24 dc-rounded-sm dc-shadow-xl dc-mx-auto"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                    }}
                >
                    <button 
                        onClick={onClose}
                        className="dc-right-16 dc-top-16 hover:dc-text-white dc-absolute dc-text-gray-400"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>

                    <div className="dc-text-white dc-text-center">
                        {message}
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(
        modalContent,
        document.body
    );
} 