import React, { useEffect, useState } from "react"
import { FaPlus, FaSearch } from "react-icons/fa"
import { MessageCircle, Plus, X, Search, LogOut } from "lucide-react"
import { useLayoutStore } from "../../store/layoutStore"
import { useThemeStore } from "../../store/themeStore"
import formatTimestamp from "../../utils/formatTime"
import { useUserStore } from "../../store/userStore"
import styles from "../../style/ChatSection_modules/ChatList.module.css"
import { toast } from "react-toastify"
import { useChatStore } from "../../store/chatStore"

const ChatList = ({ contacts }) => {
  const setSelectedContact = useLayoutStore((state) => state.setSelectedContact) // if user select any contact then setSelectedContact will call
  const selectedContact = useLayoutStore((state) => state.selectedContact) // used to control style
  const theme = useThemeStore((state) => state.theme) // used to control style
  const user = useUserStore((state) => state.user) // used to verify that the last message receiver is me or not
  const clearUser = useUserStore((state) => state.clearUser)
  const [searchTerm, setSearchTerm] = useState("") // Filter the contacts
  const isChatListOpen = useChatStore((state) => state.isChatListOpen)
  const setChatListOpen = useChatStore((state) => state.setChatListOpen)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setChatListOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = async () => {
    try {
      localStorage.removeItem("auth_token")
      clearUser()
      toast.success("user logged out")
    } catch (error) {
      console.error(error, "failed to log out")
    }
  }

  // Filter contacts based on the search term
  const filteredContacts = contacts?.filter((contact) =>
    contact?.username?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const isDark = theme === "dark"

  return (
    <div
      className={`${styles.chatList} ${isChatListOpen ? styles.chatListOpen : ""} ${isDark ? styles.dark : ""}`}
    >
      <div className={styles.chatListHeader}>
        <div className={styles.brandGroup}>
          <div className={styles.brandLogo}>
            <span>S</span>
          </div>
          <div>
            <h1 className={`${styles.brandTitle} ${isDark ? styles.dark : ""}`}>
              Socketly
            </h1>
          </div>
        </div>
        <button
          className={styles.closeChatListBtn}
          onClick={() => setChatListOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <div className={styles.newChatWrapper}>
        <button className={styles.newChatBtn}>
          <Plus size={20} />
          <span>Add New Friend</span>
        </button>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchInputWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search or start new chat"
            className={`${styles.searchInput} ${isDark ? styles.dark : ""}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className={styles.clearSearchBtn}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className={`${styles.conversationsList} ${styles.customScrollbar}`}>
        <h3 className={`${styles.historyTitle} ${isDark ? styles.dark : ""}`}>
          Chats
        </h3>
        {filteredContacts.length > 0 ? (
          filteredContacts?.map((contact) => {
            const isSelected = selectedContact?._id === contact._id

            return (
              <div
                key={contact._id}
                onClick={() => {
                  setSelectedContact(contact)
                  isChatListOpen && setChatListOpen(false)
                }}
                className={`${styles.contactItem} ${isDark ? styles.dark : ""} ${
                  isSelected ? styles.selected : ""
                }`}
              >
                <img
                  src={contact?.profilePicture}
                  alt={contact?.username}
                  className={styles.avatar}
                />
                <div className={styles.contactDetails}>
                  <div className={styles.contactHeader}>
                    <h2
                      className={`${styles.username} ${
                        isDark ? styles.dark : ""
                      }`}
                    >
                      {contact.username}
                    </h2>
                    {contact?.conversation && (
                      <span className={styles.timestamp}>
                        {formatTimestamp(
                          contact?.conversation?.lastMessage?.createdAt,
                        )}
                      </span>
                    )}
                  </div>
                  <div className={styles.contactBody}>
                    <p
                      className={`${styles.lastMessage} ${
                        isDark ? styles.dark : ""
                      }`}
                    >
                      {contact?.conversation?.lastMessage?.content ||
                        contact?.conversation?.lastMessage?.fileName}
                    </p>
                    {contact?.conversation &&
                      contact?.conversation?.unreadCount > 0 &&
                      contact?.conversation?.lastMessage?.receiver ===
                        user?._id && (
                        <p
                          className={`${styles.unreadBadge} ${
                            isDark ? styles.dark : ""
                          }`}
                        >
                          {contact?.conversation?.unreadCount}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className={styles.emptyStateList}>
            <MessageCircle size={32} className={styles.emptyStateIcon} />
            <p>{searchTerm ? "No chats found" : "No chats yet"}</p>
          </div>
        )}
      </div>

      <div
        className={`${styles.userProfileFooter} ${isDark ? styles.dark : ""}`}
      >
        <div className={`${styles.userCard} ${isDark ? styles.dark : ""}`}>
          <div className={styles.avatar}>
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="profile_picture"
                className={styles.avatar}
              />
            ) : (
              user?.username?.[0]?.toUpperCase() || "U"
            )}
          </div>
          <div className={styles.userInfo}>
            <div className={`${styles.username} ${isDark ? styles.dark : ""}`}>
              {user?.username || "User"}
            </div>
            <div className={styles.userEmail}>
              {user?.email || "user@example.com"}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={styles.logoutBtn}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatList
