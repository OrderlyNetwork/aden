import React from 'react';

type PageTransitionProps = {
  children: React.ReactNode;
};

// PageTransition 컴포넌트를 임시로 비활성화
// 모든 페이지 전환 애니메이션을 일시적으로 중단
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  // 현재는 children을 그대로 반환
  // 추후 PageTransitionContext 구조 개선 후 재활성화 예정
  return <>{children}</>;
};

export default PageTransition;