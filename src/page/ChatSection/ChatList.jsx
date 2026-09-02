import React, { useState } from "react"
import { FaPlus, FaSearch } from "react-icons/fa"
import { useLayoutStore } from "../../store/layoutStore"
import { useThemeStore } from "../../store/themeStore"
import formatTimestamp from "../../utils/formatTime"
import { useUserStore } from "../../store/userStore"
import styles from "../../style/ChatSection_modules/ChatList.module.css"

const ChatList = ({ contacts }) => {
  const setSelectedContact = useLayoutStore((state) => state.setSelectedContact) // if user select any contact then setSelectedContact will call
  const selectedContact = useLayoutStore((state) => state.selectedContact) // used to control style
  const theme = useThemeStore((state) => state.theme) // used to control style
  const user = useUserStore((state) => state.user) // used to verify that the last message receiver is me or not
  const [searchTerm, setSearchTerm] = useState("") // Filter the contacts

  // Filter contacts based on the search term
  const filteredContacts = contacts?.filter((contact) =>
    contact?.username?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const isDark = theme === "dark"

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ""}`}>
      <div className={`${styles.header} ${isDark ? styles.dark : ""}`}>
        <h2 className={styles.headerTitle}>Chats</h2>
        <button className={styles.addButton}>
          <FaPlus />
        </button>
      </div>

      <div className={styles.searchWrapper}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search or start new chat"
            className={`${styles.searchInput} ${isDark ? styles.dark : ""}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.contactsList}>
        {filteredContacts?.map((contact) => {
          const isSelected = selectedContact?._id === contact._id

          return (
            <div
              key={contact._id}
              onClick={() => setSelectedContact(contact)}
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
                    {contact?.conversation?.lastMessage?.content}
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
        })}
      </div>
    </div>
  )
}

export default ChatList
