import { create } from 'zustand'
import { UserOrder } from '~/api/user_orders'

interface OrderStoreState {
  orders: UserOrder[]
  setOrders: (orders: UserOrder[]) => void
}

const useOrderStore = create<OrderStoreState>((set) => ({
  orders: [],
  setOrders: (orders: UserOrder[]) => set({ orders }),
}))

export default useOrderStore

