import { useState } from 'react';
import { postPurchaseItem } from '~/api/purchase_item';
import { Item } from '~/api/item';
import PurchaseConfirmModal from '~/components/PurchaseConfirmModal';

interface ItemPurchaseContainerProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  quantity: number;
  onSuccess?: () => void;
}

export default function ItemPurchaseContainer({
  isOpen,
  onClose,
  item,
  quantity,
  onSuccess
}: ItemPurchaseContainerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const totalPrice = item.price * quantity;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // API 호출
      const response = await postPurchaseItem({
        items: [{
          item_id: item.item_id,
          quantity: quantity
        }]
      });
      
      console.log('Purchase response:', response);
      
      // 성공 콜백 실행
      if (onSuccess) {
        onSuccess();
      }
      
      // 모달 닫기
      onClose();
    } catch (err) {
      console.error('Purchase error:', err);
      setError(typeof err === 'string' ? err : '아이템 구매에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PurchaseConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      quantity={quantity}
      totalPrice={totalPrice}
      loading={loading}
      error={error}
      onConfirm={handleConfirm}
    />
  );
} 