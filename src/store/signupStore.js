import { create } from "zustand"
import { persist } from "zustand/middleware"

const store = (set) => ({
  isOtpVerified: false,
  setIsOtpVerified: (value) => set({ isOtpVerified: value }),
})

export const useSignupStore = create(store)
