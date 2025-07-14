import api from "../utils/api";
import { setCookie, getCookie, removeCookie, hasCookie } from "../utils/cookies";
import { User } from "../store/userStore";
import { hashPassword } from "../utils/hash";

export const login = async (email: string, password: string) => {
    // 클라이언트에서 비밀번호 해싱
    const password_hash = await hashPassword(password);
    const response = await api.post('/api/auth/login', { email, password_hash });
    // Save tokens to cookies for secure storage with longer expiration (60 days)
    if (response.data.data.token && typeof window !== 'undefined') {
        setCookie('access_token', response.data.data.token, 360);
        
        // 시크릿 모드를 위한 추가 백업 (쿠키 기능 내에서도 백업하지만 추가적인 안전장치)
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('auth_access_token', response.data.data.token);
            }
        } catch (e) {
            console.error('LocalStorage backup failed:', e);
        }
    }
    if (response.data.data.refresh_token && typeof window !== 'undefined') {
        setCookie('refresh_token', response.data.data.refresh_token, 360);
        
        // 시크릿 모드를 위한 추가 백업
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('auth_refresh_token', response.data.data.refresh_token);
            }
        } catch (e) {
            console.error('LocalStorage backup failed:', e);
        }
    }
    
    return response.data;
};

export const register = async (username: string, email: string, password: string) => {
    // 클라이언트에서 비밀번호 해싱
    const password_hash = await hashPassword(password);
    const response = await api.post('/api/auth/register', { username, email, password_hash });
    return response.data;
};

export const logout = () => {
    if (typeof window !== 'undefined') {
        removeCookie('access_token');
        removeCookie('refresh_token');
        
        // localStorage 백업도 제거
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('auth_access_token');
                localStorage.removeItem('auth_refresh_token');
            }
        } catch (e) {
            console.error('LocalStorage cleanup failed:', e);
        }
    }
};

export const getToken = () => {
    if (typeof window !== 'undefined') {
        // 쿠키에서 먼저 확인
        const cookieToken = getCookie('access_token');
        if (cookieToken) return cookieToken;
        
        // 쿠키에 없으면 localStorage 확인 (시크릿 모드용)
        try {
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem('auth_access_token');
            }
        } catch (e) {
            console.error('LocalStorage read failed:', e);
        }
    }
    return null;
};

export const validateToken = async () => {
    const response = await api.get('/api/auth/validate');
    return response.data;
};

export const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
        // 쿠키 인증 확인
        const hasToken = hasCookie('access_token');
        if (hasToken) return true;
        
        // 쿠키에 없으면 localStorage 확인 (시크릿 모드용)
        try {
            if (typeof localStorage !== 'undefined') {
                return !!localStorage.getItem('auth_access_token');
            }
        } catch (e) {
            console.error('LocalStorage authentication check failed:', e);
        }
        
        return false;
    }
    return false;
};

/**
 * userStore의 user 객체를 사용하여 로그인 상태를 확인하는 함수
 * 
 * @param user - userStore에서 가져온 user 객체
 * @returns 로그인되어 있으면 true, 아니면 false
 */
export const isUserLoggedIn = (user: User | null) => {
    // user가 존재하고 user_id가 유효한지 확인
    return !!user && user.user_id > 0;
};



