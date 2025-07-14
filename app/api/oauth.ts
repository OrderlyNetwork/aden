import api from "../utils/api";
import { setCookie } from "../utils/cookies";

export const getGoogleAuthUrl = async () => {
    const response = await api.get('/api/oauth/google');
    return response.data;
};


export const getGoogleCallback = async (code: string) => {
    const response = await api.get(`/api/oauth/google/callback?code=${code}`);

    setCookie('access_token', response.data.data.token, 60);
    setCookie('refresh_token', response.data.data.refresh_token, 60);
    return response.data;
};


export const getNaverAuthUrl = async () => {
    const response = await api.get('/api/oauth/naver');
    return response.data;
};



export const getNaverCallback = async (code: string) => {
    const response = await api.get(`/api/oauth/naver/callback?code=${code}`);

    setCookie('access_token', response.data.data.token, 60);
    setCookie('refresh_token', response.data.data.refresh_token, 60);
    return response.data;
};



