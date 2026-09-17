import { create } from "zustand"

const store = (set) => ({
  error: "",
  setError: (error) => set({ error }),
})

export const useErrorStore = create(store)
