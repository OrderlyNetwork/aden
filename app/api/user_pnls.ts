import api from "../utils/api";

export type UserPnl = {
    pnl_id: string;
    user_id: number;
    symbol: string;
    direction: string;
    leverage: number;
    quantity: number;
    entry_price: number;
    liquidation_price: number;
    pnl: number;
    opening_fee: number;
    closed_fee: number;
    funding_fee: number;
    volume: number;
    pnl_type: string;
    bugs: number;
    created_at: number;
}

export interface UserPnlResponse {
    data: UserPnl[];
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
}

export const getUserPnls = async (user_id: number, start_date: number = new Date().setHours(0, 0, 0, 0) / 1000, end_date: number = new Date().setHours(23, 59, 59, 999) / 1000, offset: number = 0, limit: number = 10) => {
    const response = await api.get<UserPnlResponse>(`/api/users/${user_id}/pnls?start_date=${start_date.toFixed(0)}&end_date=${end_date.toFixed(0)}&offset=${offset}&limit=${limit}`);
    return response.data;
};

// Get all user P&Ls without date filter, with pagination  
export const getAllUserPnls = async (user_id: number, offset: number = 0, limit: number = 10) => {
    const response = await api.get<UserPnlResponse>(`/api/users/${user_id}/pnls?offset=${offset}&limit=${limit}`);
    return response.data;
};
