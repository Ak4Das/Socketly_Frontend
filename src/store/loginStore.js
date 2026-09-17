import { create } from "zustand"

const store = (set) => ({
  step: 1,
  userPhoneData: null,
  setStep: (step) => set({ step }),
  setUserPhoneData: (data) => set({ userPhoneData: data }),
  resetLoginState: () => set({ step: 1, userPhoneData: null }),
})

export const useLoginStore = create(store)
