import api from "../utils/api";

export type UserOrder = {
    order_id: string;
    user_id: number;
    symbol: string;
    order_type: string;
    direction: string;
    quantity: number;
    order_price: number;
    entry_price: number;
    status: string;
    created_at: number;
    version: number;
}

export interface UserOrderResponse {
    data: UserOrder[];
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
}

export const getUserOrders = async (user_id: number, start_date: number = new Date().setHours(0, 0, 0, 0) / 1000, end_date: number = new Date().setHours(23, 59, 59, 999) / 1000, offset: number = 0, limit: number = 10) => {
    const response = await api.get<UserOrderResponse>(`/api/users/${user_id}/orders?start_date=${start_date.toFixed(0)}&end_date=${end_date.toFixed(0)}&offset=${offset}&limit=${limit}`);
    return response.data;
};

// Get all user orders without date filter, with pagination
export const getAllUserOrders = async (user_id: number, offset: number = 0, limit: number = 10) => {
    const response = await api.get<UserOrderResponse>(`/api/users/${user_id}/orders?offset=${offset}&limit=${limit}`);
    return response.data;
};
