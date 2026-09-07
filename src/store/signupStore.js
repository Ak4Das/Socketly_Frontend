import { create } from "zustand"
import { persist } from "zustand/middleware"

const store = (set) => ({
  isOtpVerified: false,
  setIsOtpVerified: (value) => set({ isOtpVerified: value }),
})

const persistOptions = {
  name: "signup-storage",
  getStorage: () => localStorage, // use localstorage
}

export const useSignupStore = create(persist(store, persistOptions))
