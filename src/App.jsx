import { useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import HomeScreen from "./components/HomePage.jsx"
import UserDetails from "./components/UserDetails.jsx"
import Login from "./page/UserLogin/Login.jsx"
import { ProtectedRoute, PublicRoute } from "./Protected.jsx"
import Setting from "./page/SettingSection/Settings.jsx"
import { useChatStore } from "./store/chatStore"
import { useUserStore } from "./store/userStore"
import { disconnectSocket, initializeSocket } from "./services/chat.service"
import Signup from "./page/UserLogin/signup.jsx"
import Home from "./page/Home.jsx"

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
  }, [user])

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      cleanup()
      disconnectSocket()
    }
  }, [])

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/user-signup" element={<Signup />} />
            <Route path="/user-login" element={<Login />} />
          </Route>
          // ProtectedRoute component will re-render on every route change
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/user-details" element={<UserDetails />} />
            <Route path="/setting" element={<Setting />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
