import api from "~/utils/api";

// 아이템 관련 타입 정의
export interface Item {
    item_id: number;
    name: string;
    description: string | null;
    price: number;
    category: string | null;
    image_url: string | null;
    stock: number;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}


interface CreateItemRequest {
    name: string;
    description?: string;
    price: number;
    category?: string;
}

interface UpdateItemRequest {
    item_id: number;
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    status?: 'active' | 'inactive';
}



interface UseItemRequest {
    user_item_id: number;
    quantity?: number;
    duration_days?: number;
}
  
  

export const getAllItems = async (category: string | null = null) => {
    const response = await api.get(`/api/items`, {
        params: { category },
    });
    return response.data;
};


export const postItem = async (item: CreateItemRequest) => {
    const response = await api.post(`/api/items`, item);
    return response.data;
};

export const putItem = async (item: UpdateItemRequest) => {
    const response = await api.put(`/api/items/${item.item_id}`, item);
    return response.data;
};


export const postUseItem = async (use_item: UseItemRequest) => {
    const response = await api.post(`/api/items/user/use`, use_item);
    return response.data;
};




