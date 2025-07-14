import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getCookie, setCookie, removeCookie } from '../utils/cookies'

export interface User {
  user_id: number
  username: string
  email: string
  level: number
  is_admin: boolean
  profile_image_url: string
  created_at: string
}

interface UserStoreState {
  user: User
  setUser: (user: User) => void
  resetUser: () => void
  isHydrated: boolean
  setHydrated: (hydrated: boolean) => void
}

const initialState = {
  user: {
    user_id: -1,
    username: "",
    email: "",
    level: 0,
    is_admin: false,
    profile_image_url: "",
    created_at: "",
  }
}

// Create a custom storage object that uses cookies instead of localStorage
const customStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null
    const value = getCookie(name)
    return value
  },
  setItem: (name: string, value: string) => {
    if (typeof window !== 'undefined') {
      // 90일 동안 유지되는 쿠키 설정
      setCookie(name, value, 90)
    }
  },
  removeItem: (name: string) => {
    if (typeof window !== 'undefined') {
      removeCookie(name)
    }
  },
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      user: initialState.user,
      isHydrated: false,
      setUser: (user: User) => set({ user }),
      resetUser: () => set({ user: initialState.user }),
      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => customStorage),
      // 앱이 로드될 때 스토리지에서 상태를 자동으로 복원
      skipHydration: false,
      // 상태가 변경될 때마다 스토리지에 저장
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true)
        }
      }
    }
  )
)

export default useUserStore 