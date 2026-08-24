import { create } from "zustand"
import { persist } from "zustand/middleware"

const store = (set) => ({
  activeTab: "chats",
  selectedContact: null,
  setSelectedContact: (contact) => set({ selectedContact: contact }),
  setActiveTab: (tab) => {
    set({ activeTab: tab })
  },
})

const persistUserOptions = {
  name: "whatsapp-storage",
  getStorage: () => localStorage, // use localstorage
}

const useStore = create(persist(store, persistUserOptions))
export default useStore
