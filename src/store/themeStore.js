import { create } from "zustand"
import { persist } from "zustand/middleware"

const store = (set) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
})

const persistOptions = {
  name: "theme-storage",
  getStorage: () => localStorage, // use localstorage
}

const useThemeStore = create(persist(store, persistOptions))

export default useThemeStore
