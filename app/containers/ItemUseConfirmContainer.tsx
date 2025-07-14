import { useState } from 'react';
import { postUseItem } from '~/api/item';
import ItemUseConfirmModal from '~/components/ItemUseConfirmModal';

interface ItemUseConfirmContainerProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemId: number;
  quantity: number;
  availableQuantity: number;
  onSuccess?: (itemId: number) => void;
}

export default function ItemUseConfirmContainer({
  isOpen,
  onClose,
  itemName,
  itemId,
  quantity,
  availableQuantity,
  onSuccess
}: ItemUseConfirmContainerProps) {
  const [loading, setLoading] = useState(false);
  
  const handleConfirm = async (itemId: number, quantity: number) => {
    try {
      setLoading(true);
      
      // API 호출
      await postUseItem({
        user_item_id: itemId,
        quantity: quantity,
        duration_days: 1
      });
      
      console.log('Item used successfully:', { itemId, quantity });
      
      // 성공 콜백 실행
      if (onSuccess) {
        onSuccess(itemId);
      }
      
      // 모달 닫기
      onClose();
    } catch (err) {
      console.error('Item use error:', err);
      // If needed, add error handling here
    } finally {
      setLoading(false);
    }
  };

  return (
    <ItemUseConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      itemName={itemName}
      itemId={itemId}
      quantity={quantity}
      availableQuantity={availableQuantity}
      loading={loading}
      onConfirm={handleConfirm}
    />
  );
} 