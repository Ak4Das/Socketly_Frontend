import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaWhatsapp, FaUser, FaCog, FaUserCircle } from "react-icons/fa"
import { MdRadioButtonChecked } from "react-icons/md"
import useStore from "../store/layoutStore"
import userStore from "../store/useUserStore"
import useThemeStore from "../store/themeStore"
import styles from "../style/components_modules/Sidebar.module.css"

const Sidebar = () => {
  const location = useLocation()
  const user = userStore((state) => state.user) // used for user's profile picture only
  const activeTab = useStore((state) => state.activeTab) // used to control styles only
  const setActiveTab = useStore((state) => state.setActiveTab)
  const selectedContact = useStore((state) => state.selectedContact) // used to hide sidebar if user selected any contact
  const theme = useThemeStore((state) => state.theme) // used to control styles only
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768) // used to control styles only

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (location.pathname === "/") {
      setActiveTab("chats")
    } else if (location.pathname === "/status") {
      setActiveTab("status")
    } else if (location.pathname === "/user-details") {
      setActiveTab("user")
    } else if (location.pathname === "/setting") {
      setActiveTab("setting")
    }
  }, [location, setActiveTab])

  // Don't render sidebar when a chat is selected on mobile
  if (isMobile && selectedContact) {
    return null
  }

  const getIconClass = (tabName) => {
    if (activeTab === tabName) {
      return theme === "dark" ? styles.iconActiveDark : styles.icon
    }
    return theme === "dark" ? styles.iconDark : styles.icon
  }

  return (
    <div
      className={`${styles.sidebar} ${
        isMobile ? styles.sidebarMobile : ""
      } ${theme === "dark" ? styles.sidebarDark : ""}`}
    >
      <Link
        to="/"
        className={`${styles.navLink} ${
          !isMobile ? styles.navLinkDesktop : ""
        } ${activeTab === "chats" ? styles.activeTab : ""}`}
      >
        <FaWhatsapp className={getIconClass("chats")} />
      </Link>
      <Link
        to="/status"
        className={`${styles.navLink} ${
          !isMobile ? styles.navLinkDesktop : ""
        } ${activeTab === "status" ? styles.activeTab : ""}`}
      >
        <MdRadioButtonChecked className={getIconClass("status")} />
      </Link>
      {!isMobile && <div className={styles.spacer} />}
      <Link
        to="/user-details"
        className={`${styles.navLink} ${
          !isMobile ? styles.navLinkDesktop : ""
        } ${activeTab === "user" ? styles.activeTab : ""}`}
      >
        {user?.profilePicture ? (
          <img src={user.profilePicture} alt="User" className={styles.avatar} />
        ) : (
          <FaUserCircle className={getIconClass("status")} />
        )}
      </Link>
      <Link
        to="/setting"
        className={`${styles.navLink} ${
          !isMobile ? styles.navLinkDesktop : ""
        } ${activeTab === "setting" ? styles.activeTab : ""}`}
      >
        <FaCog className={getIconClass("setting")} />
      </Link>
    </div>
  )
}

export default Sidebar
