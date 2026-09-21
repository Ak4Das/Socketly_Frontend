import { create } from "zustand"
import { persist } from "zustand/middleware"

const store = (set) => ({
  activeTab: "chats", // Used in sidebar to control layout and style
  selectedContact: null,
  setSelectedContact: (contact) => set({ selectedContact: contact }),
  setActiveTab: (tab) => {
    set({ activeTab: tab })
  },
})

const persistUserOptions = {
  name: "socketly-storage",
  getStorage: () => localStorage, // use localstorage
}

export const useLayoutStore = create(persist(store, persistUserOptions))
