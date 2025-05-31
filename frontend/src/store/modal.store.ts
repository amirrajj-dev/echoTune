import { create } from "zustand";

interface ModalsStore {
    isSongsModalOpen : boolean;
    isAlbumsModalOpen : boolean;
    setIsSongsModalOpen : (isOpen : boolean)=>void;
    setIsAlbumsModalOpen : (isOpen : boolean)=>void;
}

export const useModals = create<ModalsStore>((set) => ({
    isSongsModalOpen : false,
    isAlbumsModalOpen : false,
    setIsSongsModalOpen : (isOpen : boolean) => set({isSongsModalOpen : isOpen}),
    setIsAlbumsModalOpen : (isOpen : boolean) => set({isAlbumsModalOpen : isOpen}),
}))