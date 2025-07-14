import api from "../utils/api";

export type UserProfile = {
    username?: string;
    email?: string;
    profile_image_url?: string;
    level?: number;
}

export interface UserProfileResponse {
    success: boolean;
    message: string;
    user_id: number;
}

export const putUserProfile = async (user_id: number, user_data: UserProfile) => {
    const response = await api.put<UserProfileResponse>(`/api/users/${user_id}`, user_data);
    return response.data;
};
