// Cookie utility functions for secure authentication with localStorage backup

// Set a secure cookie with localStorage backup
export const setCookie = (name: string, value: string, minutes = 30, secure = true) => {
  try {
    const date = new Date();
    // 만료 시간을 분 단위로 설정
    date.setTime(date.getTime() + minutes * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    
    // SameSite=Lax로 변경하여 크로스 사이트 요청 시에도 쿠키가 전송되도록 함
    // 이는 새로고침 후에도 인증이 유지되는데 중요
    document.cookie = `${name}=${value};${expires};path=/;${secure ? 'secure;' : ''}SameSite=Lax`;
    
    // localStorage에도 백업 (시크릿 모드용)
    try {
      // localStorage가 사용 가능한지 확인
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`cookie_backup_${name}`, value);
        localStorage.setItem(`cookie_backup_${name}_expires`, date.getTime().toString());
      }
    } catch (localStorageError) {
      console.error('Error setting localStorage backup:', localStorageError);
    }
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
};

// Get cookie by name with localStorage backup
export const getCookie = (name: string): string | null => {
  try {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }

    // 쿠키가 없으면 localStorage에서 확인 (시크릿 모드용)
    try {
      if (typeof localStorage !== 'undefined') {
        const backupValue = localStorage.getItem(`cookie_backup_${name}`);
        const backupExpires = localStorage.getItem(`cookie_backup_${name}_expires`);
        
        // 값이 있고 만료되지 않았는지 확인
        if (backupValue && backupExpires) {
          const expiryTime = parseInt(backupExpires, 10);
          if (!isNaN(expiryTime) && expiryTime > Date.now()) {
            return backupValue;
          } else {
            // 만료되었으면 제거
            localStorage.removeItem(`cookie_backup_${name}`);
            localStorage.removeItem(`cookie_backup_${name}_expires`);
          }
        }
      }
    } catch (localStorageError) {
      console.error('Error getting localStorage backup:', localStorageError);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
};

// Remove cookie and localStorage backup
export const removeCookie = (name: string) => {
  try {
    // 쿠키 제거
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
    
    // localStorage 백업도 제거
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(`cookie_backup_${name}`);
        localStorage.removeItem(`cookie_backup_${name}_expires`);
      }
    } catch (localStorageError) {
      console.error('Error removing localStorage backup:', localStorageError);
    }
  } catch (error) {
    console.error('Error removing cookie:', error);
  }
};

// Check if cookie exists with localStorage backup
export const hasCookie = (name: string): boolean => {
  // 쿠키나 localStorage 백업 중 하나라도 있으면 true
  const cookieValue = getCookie(name);
  return !!cookieValue;
}; 