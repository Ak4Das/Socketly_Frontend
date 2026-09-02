import { create } from "zustand"
import { persist } from "zustand/middleware"

const store = (set) => ({
  user: null,
  isAuthenticated: false,
  isIOnline: false,
  setUser: (userData) => set({ user: userData, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  setIsIOnline: (value) => set({ isIOnline: value }),
})

const persistUserOptions = {
  name: "user-storage",
  getStorage: () => localStorage, // use localstorage
}

export const useUserStore = create(persist(store, persistUserOptions))
