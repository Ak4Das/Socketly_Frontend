import { create } from "zustand"
import axiosInstance from "../services/url.service"
import { getSocket } from "../services/chat.service"
// We can access, update, delete Zustand states outside a component
import { useErrorStore } from "./errorStore"
const { setError } = useErrorStore.getState()

const store = (set, get) => ({
  currentUser: null, // Current user is me
  conversations: {}, // List of all conversations
  currentConversation: null, // Currently selected conversation ID
  messages: [], // Messages of the current conversation
  loading: false, // Loader for API calls
  onlineUsers: new Map(), // userId -> { isOnline, lastSeen }
  typingUsers: new Map(), // conversationId -> Set of userIds who are typing
  isChatListOpen: false, // controls the chatList open and close

  // Socket Event Listeners Setup
  initSocketListeners: () => {
    const socket = getSocket()
    if (!socket) return

    // Remove existing listeners to prevent duplicate handlers
    socket.off("receive_message")
    socket.off("message_send")
    socket.off("message_read")
    socket.off("reaction_update")
    socket.off("message_deleted")
    socket.off("message_error")
    socket.off("user_typing")
    socket.off("user_status")

    // Listen for incoming messages
    socket.on("receive_message", (message) => {
      get().receiveMessage(message)
    })

    // Confirm message delivery
    socket.on("message_send", (message) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === message._id ? { ...msg } : msg,
        ),
      }))
    })

    // Mark message as read
    socket.on("message_read", (message) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === message._id ? { ...msg, messageStatus: "read" } : msg,
        ),
      }))
    })

    // Handle reactions on messages
    socket.on("reaction_update", ({ messageId, reactions }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId ? { ...msg, reactions } : msg,
        ),
      }))
    })

    // Remove a message from local state when deleted by sender (real-time sync)
    socket.on("message_deleted", (deletedMessageId) => {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.log("Message deleted:", deletedMessageId)
      }
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== deletedMessageId),
      }))
    })

    // Handle any message sending error
    socket.on("message_error", (error) => {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error("Message error:", error.message)
        console.dir(error)
      }
    })

    // Listen for typing indicators
    socket.on("user_typing", ({ userId, conversationId, isTyping }) => {
      set((state) => {
        // Create a new Map because Zustand (and React) detect changes by reference.
        const newTypingUsers = new Map(state.typingUsers)
        if (!newTypingUsers.has(conversationId)) {
          newTypingUsers.set(conversationId, new Set())
        }

        const typingSet = newTypingUsers.get(conversationId)
        if (isTyping) {
          typingSet.add(userId)
        } else {
          typingSet.delete(userId)
        }

        return { typingUsers: newTypingUsers }
      })
    })

    // Track user's online/offline status
    socket.on("user_status", ({ userId, isOnline, lastSeen }) => {
      set((state) => {
        // Create a new Map
        const newOnlineUsers = new Map(state.onlineUsers)
        newOnlineUsers.set(userId, { isOnline, lastSeen })
        return { onlineUsers: newOnlineUsers }
      })
    })

    // Emit status (online or offline) check for all users in the conversation list
    const { conversations } = get()
    if (conversations?.data?.length > 0) {
      conversations.data.forEach((conversation) => {
        const otherUser = conversation.participants.find(
          (p) => p._id !== get().currentUser?._id,
        )
        if (otherUser?._id) {
          socket.emit("get_user_status", otherUser._id, (status) => {
            /* Socket.IO sends status obj from backend to frontend inside this callback function argument through callback mechanism and this callback function execute in the frontend side.
             With this way only i can get any value from event handler of the get_user_status event listener */
            set((state) => {
              const newOnlineUsers = new Map(state.onlineUsers)
              newOnlineUsers.set(status.userId, {
                isOnline: status.isOnline,
                lastSeen: status.lastSeen,
              })
              return { onlineUsers: newOnlineUsers }
            })
          })
        }
      })
    }
  },

  // Set Current User
  setCurrentUser: (user) => set({ currentUser: user }),

  // Set chat list open or close
  setChatListOpen: (value) => set({ isChatListOpen: value }),

  // Fetch Conversations from API
  fetchConversations: async () => {
    set({ loading: true })
    try {
      const { data } = await axiosInstance.get("/chats/conversations")
      set({ conversations: data, loading: false })

      // Initialize socket after fetching conversations
      get().initSocketListeners()
      return data
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error.response?.data?.message || error.message)
        console.dir(error)
      }
      set({
        loading: false,
      })
      setError(error.response?.data?.message || error.message)
    }
  },

  // Fetch Messages for a Conversation
  fetchMessages: async (conversationId) => {
    if (!conversationId) return

    set({ loading: true })
    try {
      const { data } = await axiosInstance.get(
        `/chats/conversations/${conversationId}/messages`,
      )

      const messageArray = data.data || []

      set({
        messages: messageArray,
        currentConversation: conversationId,
        loading: false,
      })

      // Mark unread messages as read
      const { markMessagesAsRead } = get()

      await markMessagesAsRead()

      return messageArray
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(
          "Error fetching messages:",
          error.response?.data?.message || error.message,
        )
        console.dir(error)
      }
      set({
        loading: false,
      })
      setError(error.response?.data?.message || error.message)
    }
  },

  // Send a Message with Optimistic Update
  sendMessage: async (formData) => {
    const senderId = formData.get("senderId")
    const receiverId = formData.get("receiverId")
    const media = formData.get("media")
    const content = formData.get("content")
    const messageStatus = formData.get("messageStatus")

    // Find existing conversation between sender & receiver
    const { conversations } = get()
    let conversationId = null

    if (conversations?.data?.length > 0) {
      const conversation = conversations.data.find(
        (conversation) =>
          conversation.participants.some((p) => p._id === senderId) &&
          conversation.participants.some((p) => p._id === receiverId),
      )

      if (conversation) {
        conversationId = conversation._id
        set({ currentConversation: conversationId })
      }
    }

    // Temporary message before actual response
    const tempId = `temp-${Date.now()}`
    const optimisticMessage = {
      _id: tempId,
      sender: { _id: senderId },
      receiver: { _id: receiverId },
      conversation: conversationId,
      fileName: media ? media.name : "",
      fileSize: media ? media.size : "",
      documentViewUrl: media && URL.createObjectURL(media),
      content: content,
      contentType: media ? media.type : "text",
      createdAt: new Date().toISOString(),
      messageStatus,
    }

    set((state) => ({
      messages: [...state.messages, optimisticMessage],
    }))

    try {
      // Send to backend API
      const { data } = await axiosInstance.post(
        "/chats/send-message",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      )
      const messageData = data.data || {}

      // Replace optimistic message with real one
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempId ? messageData : msg,
        ),
      }))

      const socket = getSocket()

      // Notify other user via socket
      if (socket) {
        socket.emit("send_message", messageData)
      }
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(
          "Error sending message:",
          error.response?.data?.message || error.message,
        )
        console.dir(error)
      }
      // Mark message as failed if API fails
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempId ? { ...msg, messageStatus: "failed" } : msg,
        ),
      }))
      setError(error.response?.data?.message || error.message)
      throw error
    }
  },

  // Add Message from Socket into Store
  receiveMessage: (message) => {
    if (!message) return

    const { currentConversation, currentUser, messages } = get()

    const messageExists = messages.some((msg) => msg._id === message._id)
    if (messageExists) return

    if (message.conversation === currentConversation) {
      set((state) => ({
        messages: [...state.messages, message],
      }))

      // Automatically mark as read if viewing the conversation
      if (message.receiver?._id === currentUser?._id) {
        get().markMessagesAsRead()
      }
    }

    // Update conversation preview and unread count
    set((state) => {
      const updatedConversations = state.conversations?.data?.map(
        (conversation) => {
          if (conversation._id === message.conversation) {
            return {
              ...conversation,
              lastMessage: message,
              unreadCount:
                message.receiver?._id === currentUser?._id
                  ? (conversation.unreadCount || 0) + 1
                  : conversation.unreadCount || 0,
            }
          }
          return conversation
        },
      )

      return {
        conversations: {
          ...state.conversations,
          data: updatedConversations,
        },
      }
    })
  },

  // Mark Unread Messages as Read
  markMessagesAsRead: async () => {
    const { messages, currentUser } = get()
    if (!messages?.length || !currentUser) return

    const unreadIds = messages
      .filter(
        (msg) =>
          msg.messageStatus !== "read" &&
          msg.receiver?._id === currentUser?._id,
      )
      .map((msg) => msg._id)

    if (unreadIds.length === 0) return

    try {
      const { data } = await axiosInstance.put("/chats/messages/read", {
        messageIds: unreadIds,
      })
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.log("Marked as read", data)
      }

      set((state) => ({
        messages: state.messages.map((msg) =>
          unreadIds.includes(msg._id) ? { ...msg, messageStatus: "read" } : msg,
        ),
      }))
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(
          "Failed to mark messages as read:",
          error.response?.data?.message || error.message,
        )
        console.dir(error)
      }
      setError(error.response?.data?.message || error.message)
    }
  },

  // Delete a message by ID
  deleteMessage: async (messageId, currentUser) => {
    try {
      // Make API call to delete the message
      await axiosInstance.delete(`/chats/messages/${messageId}`)

      // Optimistically remove from local state
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }))

      return true
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(
          "Error deleting message:",
          error.response?.data?.message || error.message,
        )
        console.dir(error)
      }
      setError(error.response?.data?.message || error.message)
    }
  },

  // Delete messages by conversationId
  deleteAllMessages: async (currentConversationId, userId, receiverId) => {
    try {
      // Make API call to delete the message
      const response = await axiosInstance.delete(
        `/chats/conversations/${currentConversationId}/user/${userId}/receiver/${receiverId}/messages`,
      )

      return response.data
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(
          "Error deleting message:",
          error.response?.data?.message || error.message,
        )
        console.dir(error)
      }
      setError(error.response?.data?.message || error.message)
      throw error
    }
  },

  // Add / Change / Delete Reaction
  addReaction: async (messageId, emoji) => {
    const socket = getSocket()
    const { currentUser } = get()

    if (socket && currentUser) {
      socket.emit("add_reaction", {
        messageId,
        emoji,
        userId: currentUser._id,
      })
    }
  },

  // Typing start Event
  startTyping: (receiverId) => {
    const { currentConversation } = get()
    const socket = getSocket()

    if (socket && currentConversation && receiverId) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.log("Emitting typing start:", currentConversation, receiverId)
      }
      socket.emit("typing_start", {
        conversationId: currentConversation,
        receiverId,
      })
    }
  },

  // Cleanup Store
  cleanup: () => {
    // Clear all chat data from the store
    set({
      conversations: [],
      currentConversation: null,
      messages: [],
      onlineUsers: new Map(),
      typingUsers: new Map(),
    })
  },
})

export const useChatStore = create(store)
