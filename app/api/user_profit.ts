import api from "../utils/api";

interface UserTodayProfitResponse {
    today_usdt_gain: number;
    today_bugs_gain: number;
}

export const getUserTodayProfit = async (userId: number) => {
    const response = await api.get<UserTodayProfitResponse>(`/api/users/${userId}/today-profit`);
    return response.data;
}
