import { Navigate, useLocation } from '@remix-run/react';
import { ReactNode, useEffect, useState } from 'react';
import { isAuthenticated } from '../api/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  
  useEffect(() => {
    // 클라이언트 사이드에서만 인증 체크
    if (typeof window !== 'undefined') {
      const authed = isAuthenticated();
      setIsAuthed(authed);
      setAuthChecked(true);
    }
  }, []);

  // 인증 체크가 완료되기 전에는 아무것도 렌더링하지 않음
  if (!authChecked) {
    return null;
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthed) {
    return <Navigate to="/" state={{ from: location, needAuth: true }} replace />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default ProtectedRoute; 