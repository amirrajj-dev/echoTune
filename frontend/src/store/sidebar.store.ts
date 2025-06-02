import { create } from "zustand";
import type { IUser } from "../interfaces/interfaces";

interface SidebarStore {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  toggleSidebar: () => void;
  allUsers: IUser[];
  query: string;
  setQuery: (q: string) => void;
  setAllUsers: (users: IUser[]) => void;
  filteredUsers: () => IUser[];
}

export const useSidebar = create<SidebarStore>((set , get) => ({
  isSidebarOpen: window.innerWidth >= 768, // Open by default on desktop
  setIsSidebarOpen: (value: boolean) => set({ isSidebarOpen: value }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  allUsers: [],
  query: "",
  setQuery: (q) => set({ query: q }),
  setAllUsers: (users) => set({ allUsers: users }),
  filteredUsers: () => {
    const { query, allUsers } = get();
    return query
      ? allUsers.filter((user : IUser) =>
          user.fullName.toLowerCase().includes(query.toLowerCase())
        )
      : allUsers;
  },
}));
