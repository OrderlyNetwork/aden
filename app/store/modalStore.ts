import { create } from 'zustand'

interface ModalStore {
    isOpen: boolean
    onClose: () => void
    isOpenSignInModal: boolean
    setIsOpenSignInModal: (isOpenSignInModal: boolean) => void
    onCloseSignInModal: () => void
    isOpenSignUpModal: boolean
    setIsOpenSignUpModal: (isOpenSignUpModal: boolean) => void
    onCloseSignUpModal: () => void
}


const useModalStore = create<ModalStore>((set) => ({
    isOpen: false,
    onClose: () => set({ isOpen: false }),
    isOpenSignInModal: false,
    setIsOpenSignInModal: (isOpenSignInModal: boolean) => set({ isOpenSignInModal }),
    onCloseSignInModal: () => set({ isOpenSignInModal: false }),
    isOpenSignUpModal: false,
    setIsOpenSignUpModal: (isOpenSignUpModal: boolean) => set({ isOpenSignUpModal }),
    onCloseSignUpModal: () => set({ isOpenSignUpModal: false }),
}))

export default useModalStore


