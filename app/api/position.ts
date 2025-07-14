import api from "../utils/api";

export const getPositions = async () => {
    const response = await api.get('/api/positions');
    return response.data;
};

export const postPositions = async (position: any) => {
    const response = await api.post('/api/positions', position);
    return response.data;
};



