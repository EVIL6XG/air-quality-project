import { createContext, useContext, useEffect } from "react"

import { useUIStore } from "@/stores/ui-store"

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const theme = useUIStore((state) => state.theme)
  const setTheme = useUIStore((state) => state.setTheme)
  const toggleTheme = useUIStore((state) => state.toggleTheme)

  useEffect(() => {
    const root = document.documentElement

    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
