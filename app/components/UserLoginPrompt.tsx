import React from 'react';

interface UserLoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInClick: () => void;
  onSignUpClick: () => void;
  className?: string;
}

const UserLoginPrompt: React.FC<UserLoginPromptProps> = ({ 
  isOpen, 
  onClose, 
  onSignInClick,
  onSignUpClick,
  className = '' 
}) => {
  if (!isOpen) return null;

  const handleSignInClick = () => {
    onClose();
    onSignInClick();
  };

  const handleSignUpClick = () => {
    onClose();
    onSignUpClick();
  };

  return (
    <div className={`dc-absolute dc-top-full dc-right-0 dc-mt-8 dc-w-280 dc-bg-gradient-to-br dc-from-[#1C1E21] dc-to-[#111316] dc-border dc-border-[#1F2126] dc-rounded-[20px] dc-shadow-xl dc-z-50 dc-overflow-hidden ${className}`}>
      {/* 환영 메시지 */}
      <div className="dc-p-16 dc-border-b dc-border-[#1F2126]">
        <div className="dc-text-center dc-mb-8">
          <span className="dc-text-16 dc-text-white dc-font-medium">환영합니다!</span>
        </div>
        <div className="dc-text-center">
          <span className="dc-text-14 dc-text-[#C7AD88]">로그인하여 더 많은 기능을 이용해보세요</span>
        </div>
      </div>
      
      {/* 버튼들 */}
      <div className="dc-p-16">
        <button 
          className="dc-w-full dc-mb-12 dc-px-16 dc-py-12 dc-text-14 dc-text-white dc-bg-gradient-to-r dc-from-[#C7AD88] dc-to-[#B8A082] hover:dc-from-[#D4BB95] hover:dc-to-[#C5AD8F] dc-rounded-[8px] dc-transition-all dc-font-medium"
          onClick={handleSignInClick}
        >
          로그인
        </button>
        <button 
          className="dc-w-full dc-px-16 dc-py-12 dc-text-14 dc-text-[#C7AD88] dc-border dc-border-[#C7AD88] hover:dc-bg-[#C7AD88] hover:dc-text-black dc-rounded-[8px] dc-transition-all dc-font-medium"
          onClick={handleSignUpClick}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default UserLoginPrompt; 