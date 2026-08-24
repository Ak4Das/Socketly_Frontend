import { create } from "zustand"
import { persist } from "zustand/middleware"

const store = (set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (userData) => set({ user: userData, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
})

const persistUserOptions = {
  name: "user-storage",
  getStorage: () => localStorage, // use localstorage
}

const userStore = create(persist(store, persistUserOptions))

export default userStore
