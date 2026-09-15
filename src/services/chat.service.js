import { io } from "socket.io-client"
import { useUserStore } from "../store/userStore"

let socket = null
const token = localStorage.getItem("auth_token")

export const initializeSocket = () => {
  if (socket) return socket

  const { user, setIsIOnline } = useUserStore.getState() // Here we subscribing to neither user and setIsIOnline nor the entire store here we simply reading the current state once

  if (!user?._id) return null

  const BACKEND_URL = import.meta.env.VITE_API_URL

  // This creates the Socket.IO client.
  socket = io(BACKEND_URL, {
    auth: { token },
    transports: ["websocket", "polling"], // Socket.IO supports multiple transport methods WebSocket is The preferred option where one connection stays open If WebSocket isn't available, Socket.IO can fall back to HTTP polling Instead of keeping one connection open, the client repeatedly asks the server for new messages
    reconnection: true, // Suppose the internet disconnects Without reconnection The socket remains disconnected until you manually reconnect or refresh the page but with reconnection: true Socket.IO automatically tries to reconnect.
    reconnectionAttempts: 10, // Maximum number of reconnection attempts
    reconnectionDelay: 1000, // Time btw reconnection attempts
  })

  //* Built in connection events
  // When client successfully connect to server then Socket.IO automatically fire connect event
  socket.on("connect", () => {
    setIsIOnline(true)
    console.log("Socket connected:", socket.id)
    socket.emit("user_connected", user._id)
  })

  // If there is some problem to establish connection then Socket.IO automatically fire connect_error event
  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error)
  })

  // If connection break then Socket.IO automatically fire disconnect event
  socket.on("disconnect", (reason) => {
    setIsIOnline(false)
    console.log("Socket disconnected:", reason)
  })

  return socket
}

export const getSocket = () => {
  return initializeSocket()
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
