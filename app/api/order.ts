import api from "../utils/api";
import { Order } from "~/store/orderStore";


type PostOrder = Omit<Order, 'order_id' | 'created_at' | 'version'>;
type PutOrder = Omit<Order, 'created_at' | 'version'>;

export const getOrders = async () => {
    const response = await api.get(`/api/orders`);
    return response.data;
};

export const postOrders = async (order: PostOrder) => {
    // string to number
    const response = await api.post(`/api/orders`, order);
    return response.data;
};

export const putOrders = async (order: PutOrder) => {
    const response = await api.put(`/api/orders/${order.order_id}`, order);
    return response.data;
};

