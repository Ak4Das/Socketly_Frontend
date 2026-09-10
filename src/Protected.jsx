import React, { useEffect, useState } from "react"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useUserStore } from "./store/userStore"
import { checkUserAuth } from "./services/user.service"
import Loader from "./utils/Loader"

export const ProtectedRoute = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true) // Show or hide loader while checking auth status
  const [progress, setProgress] = useState(0)

  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const setUser = useUserStore((state) => state.setUser)
  const clearUser = useUserStore((state) => state.clearUser)

  useEffect(() => {
    const verifyAuth = async () => {
      if (!localStorage.getItem("auth_token")) {
        clearUser()
        navigate("/home")
        return
      }
      try {
        // check if the user is authenticated
        const result = await checkUserAuth()

        if (result?.isAuthenticated) {
          setUser(result?.user) // update store with user info
        } else {
          clearUser() // clear user state
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        clearUser() // On error, assume unauthenticated
      } finally {
        setProgress(100)
        setTimeout(() => {
          setIsChecking(false) // hide loader
        }, 3000)
      }
    }

    verifyAuth()
  }, [])

  if (isChecking) {
    return <Loader progress={progress} />
  }

  if (!isAuthenticated) {
    // If user not authenticated then redirect to login page
    // if state={{ from: "/profile" } means user coming from "/profile" page, we can access it by console.log(useLocation().state?.from)
    // replace attribute prevent user to back to previous page by clicking browsers back button
    return <Navigate to="/user-login" state={{ from: location }} replace />
  }

  // If current route is allowed then render component of the route here
  return <Outlet />
}

export const PublicRoute = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    // If user is already logged in redirect to home page
    return <Navigate to="/" replace />
  }

  // User not logged in allow access to public routes
  return <Outlet />
}
