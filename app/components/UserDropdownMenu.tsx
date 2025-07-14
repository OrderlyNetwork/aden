import React from 'react';
import { Link } from '@remix-run/react';
import { logout } from '~/api/auth';
import { useUserStore } from '~/store/userStore';
import { useTranslation } from '~/i18n/TranslationContext';
import { useUserAssetsStore } from '~/store/userAssetsStore';
import NumberAnimation from '~/components/NumberAnimation';

interface UserDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({ 
  isOpen, 
  onClose, 
  className = '' 
}) => {
  const { resetUser } = useUserStore();
  const { t } = useTranslation();
  const { userAssets } = useUserAssetsStore();

  if (!isOpen) return null;

  const handleMenuItemClick = () => {
    onClose();
  };

  const handleLogout = () => {
    onClose();
    try {
      // 쿠키와 localStorage에서 토큰 제거
      logout();
      // 사용자 스토어 초기화
      resetUser();
      // 홈페이지로 리다이렉트
      window.location.href = "/";
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      // 오류가 발생해도 홈페이지로 리다이렉트
      window.location.href = "/";
    }
  };

  return (
    <div className={`dc-absolute dc-top-full dc-right-0 dc-mt-8 dc-p-12 dc-w-320 dc-bg-gradient-to-br dc-from-[#131416] dc-to-[#0A0A0B] dc-bg-opacity-80 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[20px] dc-z-50 dc-overflow-hidden ${className}`}>
      {/* USDT 잔액 */}
      <div className="dc-w-full dc-h-80 dc-flex dc-px-12 dc-py-16 dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[12px] dc-mb-8 dc-relative dc-overflow-hidden">
        <div className="dc-absolute dc-top-[-26px] dc-left-0 dc-w-52 dc-h-52 dc-rounded-full dc-bg-[#40B185] dc-blur-2xl"></div>
        <div className='dc-flex dc-flex-col dc-justify-center dc-w-1/2 dc-gap-8'>
          <div className='dc-flex dc-items-center dc-w-full'>
            <img src="/images/USDT.png" alt="USDT" className="dc-w-20 dc-h-20 dc-mr-4" />
            <span className="dc-text-14 dc-font-medium dc-text-[#898D99]">{t('userInfo.usdt')}</span>
          </div>
          <span className="dc-text-14 dc-font-bold dc-text-white">
            <NumberAnimation 
              value={userAssets.usdt_balance} 
              decimals={4}
            />
          </span>
        </div>
        <div className='dc-flex dc-flex-col dc-justify-center dc-w-1/2 dc-gap-8'>
          <div className='dc-flex dc-items-center dc-w-full'>
            <img src="/images/bugs.png" alt="BUGS" className="dc-w-20 dc-h-20 dc-mr-4" />
            <span className="dc-text-14 dc-font-medium dc-text-[#898D99]">{t('userInfo.bugs')}</span>
          </div>
          <span className="dc-text-14 dc-font-bold dc-text-white">
            <NumberAnimation 
              value={userAssets.bugs_balance} 
              decimals={4}
            />
          </span>
        </div>
      </div>
      
      {/* 메뉴 항목들 */}
      <div className="">
        <Link 
          to="/my_information/usdt" 
          className="dc-h-55 dc-flex dc-items-center dc-px-12 dc-py-12 dc-text-14 dc-text-[#898D99] hover:dc-bg-white/2 dc-rounded-[12px] dc-transition-colors"
          onClick={handleMenuItemClick}
        >
          {t('userInfo.usdtTransactions')}
        </Link>
        <hr className="dc-border-opacity-6 dc-border-white" />
        <Link 
          to="/my_information/bugs" 
          className="dc-h-55 dc-flex dc-items-center dc-px-12 dc-py-12 dc-text-14 dc-text-[#898D99] hover:dc-bg-white/2 dc-rounded-[12px] dc-transition-colors"
          onClick={handleMenuItemClick}
        >
          {t('userInfo.bugsTransactions')}
        </Link>
        <hr className="dc-border-opacity-6 dc-border-white" />
        <Link 
          to="/my_information/item" 
          className="dc-h-55 dc-flex dc-items-center dc-px-12 dc-py-12 dc-text-14 dc-text-[#898D99] hover:dc-bg-white/2 dc-rounded-[12px] dc-transition-colors"
          onClick={handleMenuItemClick}
        >
          {t('userInfo.useItem')}
        </Link>
        <hr className="dc-border-opacity-6 dc-border-white" />
        <Link 
          to="/my_information/info" 
          className="dc-h-55 dc-flex dc-items-center dc-px-12 dc-py-12 dc-text-14 dc-text-[#898D99] hover:dc-bg-white/2 dc-rounded-[12px] dc-transition-colors"
          onClick={handleMenuItemClick}
        >
          {t('userInfo.mypage')}
        </Link>
        <hr className="dc-border-opacity-6 dc-border-white" />
        <button 
          className="dc-h-44 dc-flex dc-items-center dc-justify-center dc-px-12 dc-py-12 dc-text-14 dc-text-[#898D99] dc-bg-white dc-bg-opacity-4 hover:dc-bg-white/5 dc-rounded-[12px] dc-transition-colors dc-w-full dc-text-left"
          onClick={handleLogout}
        >
          {t('auth.logout')}
        </button>
      </div>
    </div>
  );
};

export default UserDropdownMenu; 