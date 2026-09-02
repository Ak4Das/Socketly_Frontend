import React, { useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import HomeScreen from "./components/HomePage"
import UserDetails from "./components/UserDetails"
import StatusPage from "./page/StatusSection/StatusPage"
import Login from "./page/UserLogin/Login"
import { ProtectedRoute, PublicRoute } from "./Protected"
import Setting from "./page/SettingSection/Settings"
import { useChatStore } from "./store/chatStore"
import {useUserStore} from "./store/userStore"
import { disconnectSocket, initializeSocket } from "./services/chat.service"

function App() {
  const setCurrentUser = useChatStore((state) => state.setCurrentUser)
  const initSocketListeners = useChatStore((state) => state.initSocketListeners)
  const cleanup = useChatStore((state) => state.cleanup)
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    // Initialize socket when user is logged in
    if (user?._id) {
      const socket = initializeSocket()

      if (socket) {
        // Set current user in chat store
        setCurrentUser(user)

        // Initialize socket listeners
        initSocketListeners()
      }
    }

    // Cleanup on unmount
    return () => {
      cleanup()
      disconnectSocket()
    }
  }, [user])

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/user-login" element={<Login />} />
          </Route>

          // ProtectedRoute component will re-render on every route change
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/user-details" element={<UserDetails />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/setting" element={<Setting />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
