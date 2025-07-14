import api from "../utils/api";
import { Item } from "./item";

export interface UserItemData {
    id: number;
    user_id: number;
    item_id: number;
    quantity: number;
    purchase_date: string;
    expire_date: string | null;
    status: string;
    item: Item;
}

export interface UserItemResponse {
    success: boolean;
    message: string;
    data: UserItemData[];
}

export const getUserItems = async (user_id: number) => {
    const response = await api.get<UserItemResponse>(`/api/users/${user_id}/items`);
    return response.data;
}



