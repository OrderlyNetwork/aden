import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getCookie, setCookie, removeCookie } from '../utils/cookies'

export interface UserAssets {
    margin_mode: string
    leverage: number
    usdt_balance: number
    user_id: number
    total_profit: number
    bugs_balance: number
    free_recharge: number
    version: number
}

interface UserAssetsStoreState {
  userAssets: UserAssets
  setUserAssets: (userAssets: UserAssets) => void
}

// Create a custom storage object that uses cookies
const cookieStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null
    return getCookie(name)
  },
  setItem: (name: string, value: string) => {
    if (typeof window !== 'undefined') {
      setCookie(name, value)
    }
  },
  removeItem: (name: string) => {
    if (typeof window !== 'undefined') {
      removeCookie(name)
    }
  },
}

export const useUserAssetsStore = create<UserAssetsStoreState>()(
  persist(
    (set) => ({
      userAssets: {
        margin_mode: "cross",
        leverage: 0,
        usdt_balance: 0,
        user_id: 0,
        total_profit: 0,
        bugs_balance: 0,
        version: 0,
        free_recharge: 0,
        created_at: "",
      },
      setUserAssets: (userAssets: UserAssets) => set({ userAssets }),
    }),
    {
      name: 'userAssets',
      storage: createJSONStorage(() => cookieStorage),
    }
  )
)