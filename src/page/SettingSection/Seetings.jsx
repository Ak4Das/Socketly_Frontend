import React, { useState } from "react"
import {
  FaSearch,
  FaUser,
  FaQuestionCircle,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaComment,
} from "react-icons/fa"
import useThemeStore from "../../store/themeStore"
import Layout from "../../components/Layout"
import { Link } from "react-router-dom"
import userStore from "../../store/useUserStore"
import { toast } from "react-toastify"
import styles from "../../style/SettingSection_modules/Settings.module.css"

export default function Setting() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false)
  const { theme } = useThemeStore()
  const { user, clearUser } = userStore()

  const isDark = theme === "dark"

  const toggleThemeDialog = () => {
    setIsThemeDialogOpen(!isThemeDialogOpen)
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem("auth_token")
      clearUser()
      toast.success("user logged out")
    } catch (error) {
      console.error(error, "failed to log out")
    }
  }

  return (
    <Layout
      isThemeDialogOpen={isThemeDialogOpen}
      toggleThemeDialog={toggleThemeDialog}
    >
      <div
        className={`${styles.settingContainer} ${isDark ? styles.dark : ""}`}
      >
        <div className={`${styles.sidebar} ${isDark ? styles.dark : ""}`}>
          <div className={styles.contentWrapper}>
            <h1 className={styles.title}>Settings</h1>

            {/* Search Bar */}
            <div className={styles.searchContainer}>
              <FaSearch className={styles.searchIcon} />
              <input
                placeholder="Search settings"
                className={`${styles.searchInput} ${isDark ? styles.dark : ""}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Profile Section */}
            <div
              className={`${styles.profileCard} ${isDark ? styles.dark : ""}`}
            >
              <img
                src={user?.profilePicture}
                alt="Profile"
                className={styles.profileAvatar}
              />
              <div>
                <h2 className={styles.profileUsername}>{user?.username}</h2>
                <p className={styles.profileAbout}>{user?.about}</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className={styles.scrollableMenu}>
              <div className={styles.menuList}>
                {[
                  { icon: FaUser, label: "Account", href: "/user-details" },
                  { icon: FaComment, label: "Chats", href: "/" },
                  { icon: FaQuestionCircle, label: "Help" },
                ].map((item) => (
                  <Link
                    to={item.href}
                    key={item.label}
                    className={`${styles.navLink} ${isDark ? styles.dark : ""}`}
                  >
                    <item.icon className={styles.menuIcon} />
                    <div
                      className={`${styles.itemLabelBorder} ${
                        isDark ? styles.dark : ""
                      }`}
                    >
                      {item.label}
                    </div>
                  </Link>
                ))}

                {/* Theme Button */}
                <button
                  onClick={toggleThemeDialog}
                  className={`${styles.themeButton} ${
                    isDark ? styles.dark : ""
                  }`}
                >
                  {isDark ? (
                    <FaMoon className={styles.menuIcon} />
                  ) : (
                    <FaSun className={styles.menuIcon} />
                  )}
                  <div
                    className={`${styles.themeContent} ${
                      isDark ? styles.dark : ""
                    }`}
                  >
                    Theme
                    <span className={styles.themeValue}>
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </span>
                  </div>
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`${styles.logoutButton} ${
                  isDark ? styles.dark : ""
                }`}
              >
                <FaSignOutAlt className={styles.menuIcon} />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
