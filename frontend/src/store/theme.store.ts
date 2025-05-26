import { create } from "zustand";

interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
  initializeTheme: () => void;
}

export const useTheme = create<ThemeStore>((set) => ({
  theme: "dark",

  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      localStorage.setItem("chat-app-theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  },

  initializeTheme: () => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("chat-app-theme") || "dark";
      document.documentElement.setAttribute("data-theme", savedTheme);
      set({ theme: savedTheme });
    }
  },
}));