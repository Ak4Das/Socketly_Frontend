import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaCog, FaUserCircle } from "react-icons/fa"
import { useLayoutStore } from "../store/layoutStore"
import { useUserStore } from "../store/userStore"
import { useThemeStore } from "../store/themeStore"
import styles from "../style/components_modules/Sidebar.module.css"
import socketly from "../assets/images/favicon.svg"
import { useChatStore } from "../store/chatStore"

const Sidebar = () => {
  const location = useLocation()
  const user = useUserStore((state) => state.user) // used for user's profile picture only
  const activeTab = useLayoutStore((state) => state.activeTab) // used to control styles only
  const setActiveTab = useLayoutStore((state) => state.setActiveTab)
  const selectedContact = useLayoutStore((state) => state.selectedContact) // used to hide sidebar if user selected any contact
  const theme = useThemeStore((state) => state.theme) // used to control styles only
  const isChatListOpen = useChatStore((state) => state.isChatListOpen)
  const setChatListOpen = useChatStore((state) => state.setChatListOpen)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768) // used to control styles only
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1200)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsDesktop(window.innerWidth > 1200)
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
        onClick={() => !isDesktop && setChatListOpen(!isChatListOpen)}
      >
        <img
          src={socketly}
          alt="socketly_icon"
          className={styles.socketly_icon}
        />
      </Link>
      {/* STATUS BUTTON */}
      {/* <Link
        to="/status"
        className={`${styles.navLink} ${
          !isMobile ? styles.navLinkDesktop : ""
        } ${activeTab === "status" ? styles.activeTab : ""}`}
        onClick={() => !isDesktop && setChatListOpen(!isChatListOpen)}
      >
        <svg
          viewBox="0 0 24 24"
          height="24"
          width="24"
          preserveAspectRatio="xMidYMid meet"
          className=""
          fill="currentColor"
        >
          <title>wds-ic-status</title>
          <path
            fill="currentColor"
            d="M13.56 3.14c.1-.55.62-.92 1.15-.77a10 10 0 0 1 6.98 12.1.91.91 0 0 1-1.23.6c-.52-.18-.78-.75-.66-1.3a8 8 0 0 0-5.44-9.41c-.53-.17-.9-.68-.8-1.22Zm5.34 14.65c.42.35.48.98.08 1.37a10 10 0 0 1-13.96 0c-.4-.39-.34-1.02.08-1.38a1.11 1.11 0 0 1 1.46.09 8 8 0 0 0 10.88 0c.4-.38 1.03-.44 1.45-.09ZM3.54 15.08c-.52.19-1.1-.08-1.23-.62A10 10 0 0 1 9.29 2.37c.53-.15 1.05.22 1.15.77.1.54-.27 1.05-.8 1.22a8 8 0 0 0-5.44 9.42c.12.54-.14 1.1-.66 1.3Z"
          ></path>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
            clipRule="evenodd"
          ></path>
        </svg>
      </Link> */}
      {!isMobile && <div className={styles.spacer} />}
      <Link
        to="/user-details"
        className={`${styles.navLink} ${
          !isMobile ? styles.navLinkDesktop : ""
        } ${activeTab === "user" ? styles.activeTab : ""}`}
        onClick={() => !isDesktop && setChatListOpen(!isChatListOpen)}
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
        onClick={() => !isDesktop && setChatListOpen(!isChatListOpen)}
      >
        <FaCog
          className={`${styles.setting_icon} ${getIconClass("setting")}`}
        />
      </Link>
    </div>
  )
}

export default Sidebar
