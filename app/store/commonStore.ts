import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type MarginMode = 'cross' | 'isolated'
type BoardType = string

interface CommonState {
    selectedBoardName: string
    setSelectedBoardName: (name: string) => void
    selectedBoardType: BoardType
    setSelectedBoardType: (type: BoardType) => void
    isSoundMute: boolean
    setIsSoundMute: (isMute: boolean) => void
    isNavCollapsed: boolean
    setIsNavCollapsed: (collapsed: boolean) => void
}

const useCommonStore = create<CommonState>()(
    persist(
        (set) => ({
            selectedBoardName: '',
            setSelectedBoardName: (name: string) => set({ selectedBoardName: name }),
            selectedBoardType: '',
            setSelectedBoardType: (type: BoardType) => set({ selectedBoardType: type }),
            isSoundMute: false,
            setIsSoundMute: (isMute: boolean) => set({ isSoundMute: isMute }),
            isNavCollapsed: false,
            setIsNavCollapsed: (collapsed: boolean) => set({ isNavCollapsed: collapsed }),
        }),
        {
            name: 'anttalk-common-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ 
                isSoundMute: state.isSoundMute,
                selectedBoardType: state.selectedBoardType,
            }),
        }
    )
)

export default useCommonStore

