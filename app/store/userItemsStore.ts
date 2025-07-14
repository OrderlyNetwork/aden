import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getCookie, setCookie, removeCookie } from '../utils/cookies'
import { UserItemData } from '~/api/user_items'

interface UserItemsStoreState {
    userItems: UserItemData[]
    setUserItems: (userItems: UserItemData[]) => void
}


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


export const useUserItemsStore = create<UserItemsStoreState>()(
    persist(
        (set) => ({
            userItems: [],
            setUserItems: (userItems: UserItemData[]) => set({ userItems }),
        }),
        {
            name: 'userItems',
            storage: createJSONStorage(() => cookieStorage),
        }
    )
)



