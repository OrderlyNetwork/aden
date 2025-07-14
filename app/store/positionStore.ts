import { create } from 'zustand'

export interface Position {
    position_id: number,
    user_id: number,
    symbol: string,
    direction: string,
    quantity: number,
    entry_price: number,
    created_at: string,
    status: string,
    version: number
}

interface PositionStoreState {
    positions: Position[];
    setPositions: (positions: Position[]) => void;
}

const usePositionStore = create<PositionStoreState>((set) => ({
    positions: [
        // {
        //     position_id: "1",
        //     user_id: "1",
        //     symbol: "ETHUSDT", 
        //     direction: "Long",
        //     quantity: "1.00", 
        //     entry_price: "2,465.58", 
        //     created_at: "2024-01-01 00:00:00",
        //     status: "Open",
        //     version: "1.0"
        // }
    ],
    setPositions: (positions: Position[]) => set({ positions }),
}));

export default usePositionStore;


