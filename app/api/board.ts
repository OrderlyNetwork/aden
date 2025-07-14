import api from "../utils/api";

export type Board = {
    success: boolean;
    message: string;
    data: {
        _id: {
            $oid: string;
        };
        name: string;
        ko_name: string;
        description: string;
        category: string;
        is_active: boolean;
        authority_read: string;
        authority_write: string;
        authority_comment: string;
        order: number;
        created_at: string;
        updated_at: string;
        post_count: number;
    }[];
}


export const getBoard = async () => {
    const response = await api.get<Board>('/api/boards');
    return response.data;
};



