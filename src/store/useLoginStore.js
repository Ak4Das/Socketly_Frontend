import { create } from "zustand"
import { persist } from "zustand/middleware"

const store = (set) => ({
  step: 1,
  userPhoneData: null,
  setStep: (step) => set({ step }),
  setUserPhoneData: (data) => set({ userPhoneData: data }),
  resetLoginState: () => set({ step: 1, userPhoneData: null }),
})

const persistOptions = {
  name: "login-storage",
  getStorage: () => localStorage, // use localstorage
}

const useLoginStore = create(persist(store, persistOptions))

export default useLoginStore
