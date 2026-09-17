import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import ChatWindow from "../page/ChatSection/ChatWindow"
import { useLayoutStore } from "../store/layoutStore"
import { useThemeStore } from "../store/themeStore"
import { useLocation } from "react-router-dom"
import styles from "../style/components_modules/Layout.module.css"
import { useErrorStore } from "../store/errorStore"
import { toast } from "react-toastify"

export default function Layout({
  children, // Which component i want to render inside layout's children section
  isThemeDialogOpen, // is theme (dark or light) dialog box open from settings page
  toggleThemeDialog, // close theme dialog box function
  isStatusPreviewOpen, // is status preview page open
  statusPreviewContent, // status Content
}) {
  const selectedContact = useLayoutStore((state) => state.selectedContact) // To maintain the layout and pass to the chat window component
  const setSelectedContact = useLayoutStore((state) => state.setSelectedContact) // pass to the chat window component
  const location = useLocation() // Used to control userDetails page layout only
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768) // Used to control layout in different screen sizes
  const theme = useThemeStore((state) => state.theme) // Used to control styles only
  const setTheme = useThemeStore((state) => state.setTheme) // Used to toggle theme (dark or light)
  const error = useErrorStore((state) => state.error)
  const setError = useErrorStore((state) => state.setError)

  useEffect(() => {
    error && toast.error(error)
    setError("")
  }, [error])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={`${styles.container} ${
        theme === "dark" ? styles.containerDark : ""
      }`}
    >
      {!isMobile && <Sidebar />}
      <div
        className={`${styles.contentWrapper} ${
          isMobile ? styles.contentWrapperMobile : ""
        }`}
      >
        {(!selectedContact || !isMobile) && (
          <div
            className={`${styles.childrenPanel} ${
              isMobile ? styles.childrenPanelMobile : ""
            }`}
          >
            {children}
          </div>
        )}
        {selectedContact || !isMobile ? (
          <div className={styles.chatWindowPanel}>
            <ChatWindow
              selectedContact={selectedContact}
              setSelectedContact={setSelectedContact}
            />
          </div>
        ) : (
          <ChatWindow />
        )}
      </div>
      {isMobile && <Sidebar />}

      {/* Theme Dialog */}
      {isThemeDialogOpen && (
        <div className={styles.modalBackdrop}>
          <div
            className={`${styles.dialogCard} ${
              theme === "dark" ? styles.dialogCardDark : ""
            }`}
          >
            <h2 className={styles.dialogTitle}>Choose a theme</h2>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="light"
                  checked={theme === "light"}
                  onChange={() => setTheme("light")}
                  className={styles.radioInput}
                />
                <span>Light</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="dark"
                  checked={theme === "dark"}
                  onChange={() => setTheme("dark")}
                  className={styles.radioInput}
                />
                <span>Dark</span>
              </label>
            </div>
            <button onClick={toggleThemeDialog} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Status Preview */}
      {isStatusPreviewOpen && (
        <div className={styles.modalBackdrop}>{statusPreviewContent}</div>
      )}
    </div>
  )
}
