import { UserAssets } from "~/store/userAssetsStore";
import api from "../utils/api";


export const getUserAssets = async (user_id: number) => {
    const response = await api.get<UserAssets>(`/api/users/${user_id}/assets`);
    return response.data;
};

export const postUserAssets = async (user_id: number, asset: UserAssets) => {
    const response = await api.post(`/api/users/${user_id}/assets`, asset);
    return response.data;
};

export const putUserAssets = async (user_id: number, asset: UserAssets) => {
    const response = await api.put(`/api/users/${user_id}/assets`, asset);
    return response.data;
};



