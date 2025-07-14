import { create } from 'zustand'
import { UserPnl } from '~/api/user_pnls'

interface PnlStoreState {
    pnls: UserPnl[];
    setPnls: (pnls: UserPnl[]) => void;
}

const usePnlStore = create<PnlStoreState>((set) => ({
    pnls: [],
    setPnls: (pnls: UserPnl[]) => set({ pnls }),
}))

export default usePnlStore;

