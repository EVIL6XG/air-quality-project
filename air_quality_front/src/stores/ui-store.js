import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useUIStore = create(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: "light",
      commandPaletteOpen: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      openPalette: () => set({ commandPaletteOpen: true }),
      closePalette: () => set({ commandPaletteOpen: false }),
    }),
    {
      name: "aq-ui",
      partialize: ({ sidebarOpen, theme }) => ({ sidebarOpen, theme }),
    },
  ),
)
