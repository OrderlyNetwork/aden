import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Item } from '~/api/item';
import { useTranslation } from '~/i18n/TranslationContext';

interface ItemUseConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemId: number;
  quantity: number; // The quantity to use
  availableQuantity: number; // Total available
  onConfirm: (itemId: number, quantity: number) => void;
  loading?: boolean;
}

export default function ItemUseConfirmModal({
  isOpen,
  onClose,
  itemName,
  itemId,
  quantity,
  availableQuantity,
  onConfirm,
  loading = false
}: ItemUseConfirmModalProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    setMounted(true);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  // Close modal when clicking on the backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm(itemId, quantity);
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
          className="dc-relative dc-p-24 dc-mx-auto dc-bg-[#111318] dc-border dc-border-white dc-border-opacity-6 dc-rounded-[16px]"
        >
          <button
            onClick={onClose}
            className="dc-right-16 dc-top-16 hover:dc-text-white dc-absolute dc-text-gray-400"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <h2 className="dc-mb-16 dc-text-xl dc-font-bold dc-text-white">{t('modal.useItem')}</h2>

          <div className="dc-space-y-16">
            <div className="dc-p-12 dc-text-sm dc-text-[#C1C1C1] dc-whitespace-pre-line dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px]">
              <span className="dc-font-bold dc-text-white">{itemName}</span> {t('modal.useItemMessage')}

              <div className="dc-mt-8 dc-text-xs dc-text-[#898D99]">
                {t('modal.availableQuantity')} {availableQuantity}개
                <br />
                {t('modal.useQuantity')} {quantity}개
              </div>
            </div>

            <div className="dc-flex dc-gap-8">
              <button
                className="dc-flex-1 dc-py-12 dc-text-white dc-font-bold dc-bg-[#111318] dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px]"
                onClick={onClose}
                disabled={loading}
              >
                {t('modal.cancel')}
              </button>
              <button
                className="dc-flex-1 dc-py-12 dc-text-white dc-font-bold dc-bg-[#FDB41D] dc-rounded-[8px]"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? t('modal.processing') : t('modal.use')}
              </button>
            </div>
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