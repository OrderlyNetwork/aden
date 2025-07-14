import axios from 'axios';
import { getCookie, setCookie, removeCookie } from './cookies';
import { useNavigate } from '@remix-run/react';
import { validateToken } from '~/api/auth';
import { useUserStore } from '~/store/userStore';
import { Post } from '~/api/post';
import { transformBackendPosts } from './postTransform';

let isValidatingToken = false;

const api = axios.create({
  baseURL: 'http://121.142.204.10:8080/', // 상대 경로로 변경하여 현재 도메인을 사용하도록 함
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor: Add token to all requests
api.interceptors.request.use(
  (config) => {
    // 쿠키 또는 localStorage에서 토큰 가져오기
    let token = getCookie('access_token');
    if (!token && typeof localStorage !== 'undefined') {
      try {
        token = localStorage.getItem('auth_access_token');
      } catch (e) {
        console.error('Error reading token from localStorage:', e);
      }
    }
    
    // Define public endpoints that don't require authentication
    const publicEndpoints = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/oauth/google',
      '/api/oauth/google/callback',
      '/api/oauth/naver',
      '/api/oauth/naver/callback',
      '/api/auth/refresh',
      '/api/posts',
      '/api/leaderboard/total-profit',
      '/api/items',
      '/api/site-config'
    ];
    
    // Check if this request requires authentication
    const requiresAuth = !publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    // if (requiresAuth && !token) {
    //   // Reject request if authentication is required but user is not authenticated
    //   return Promise.reject(new Error('Authentication required'));
    // }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle token refresh
api.interceptors.response.use(
  (response) => {
    // console.log("response", response);
    // // Check if server sent a new token
    // const newToken = response.headers['x-new-token'];
    // if (newToken) {
    //   setCookie('access_token', newToken);
    //   // localStorage에도 백업
    //   try {
    //     if (typeof localStorage !== 'undefined') {
    //       localStorage.setItem('auth_access_token', newToken);
    //     }
    //   } catch (e) {
    //     console.error('Error saving new token to localStorage:', e);
    //   }
    // }
    return response;
  },
  async (error) => {

    if (isValidatingToken) {
      return Promise.reject(error);
    }

    isValidatingToken = true;
    try {
      const response = await validateToken().then((res) => {
        console.log("---------------------------------validateToken response", res);
        return res;
      }).catch((err) => {
        console.log("---------------------------------validateToken error", err);
        // Remove token from cookies and local storage
        removeCookie('access_token');
        useUserStore.getState().resetUser();
        
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('auth_access_token');
          }
        } catch (e) {
          console.error('Error removing token from localStorage:', e);
        }

        // Redirect to login page (assuming '/login' is the login route)
        // Need to ensure this runs on the client-side
        if (typeof window !== 'undefined') {
           // Avoid redirect loop if the login page itself causes a 401
           if (window.location.pathname !== '/') {
              const navigate = useNavigate();
              navigate('/');
           }
        } else {
          console.error("Cannot redirect on server side during API interceptor");
          // Potentially handle server-side logout differently if needed
        }
        return err;
      });
    } finally {
      isValidatingToken = false;
    }

    return Promise.reject(error);
  }
);

// 통합 검색 API 함수
export interface UnifiedSearchParams {
  search_query: string;
  search_type?: 'all' | 'title' | 'content' | 'author';
  board_type?: string;
  category?: string;
  page?: number;
  limit?: number;
  sort_by?: 'latest' | 'popular' | 'mostliked' | 'relevance';
  date_from?: string;
  date_to?: string;
}

export interface SearchResponse {
  success: boolean;
  data: {
    posts: Post[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_count: number;
      limit: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
  message: string;
}

export const searchPosts = async (params: UnifiedSearchParams): Promise<SearchResponse> => {
  try {
    const response = await api.get('/api/posts/search', { params });
    console.log('Raw API response:', response);
    console.log('Response data:', response.data);
    
    // 백엔드 응답을 프론트엔드 형식으로 변환
    const transformedData = {
      ...response.data,
      data: {
        ...response.data.data,
        posts: transformBackendPosts(response.data.data.posts || [])
      }
    };
    
    console.log('Transformed data:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

export default api; 
