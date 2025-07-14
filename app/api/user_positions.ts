import api from "../utils/api";

export const getUserPositions = async (user_id: number) => {
    const response = await api.get(`/api/users/${user_id}/positions`);
    return response.data;
};



