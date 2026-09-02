import React, { useState, useEffect, useRef } from "react"
import { format, isToday, isYesterday } from "date-fns"
import {
  FaVideo,
  FaArrowLeft,
  FaEllipsisV,
  FaPaperclip,
  FaPaperPlane,
  FaLock,
  FaSmile,
  FaImage,
  FaFile,
  FaTimes,
} from "react-icons/fa"
import { PiHandWavingBold } from "react-icons/pi"
import { IoChatbubbles } from "react-icons/io5"
import { BsStars } from "react-icons/bs"
import { FaRegSmileBeam } from "react-icons/fa"
import MessageBubble from "./MessageBubble"
import EmojiPicker from "emoji-picker-react"
import { useThemeStore } from "../../store/themeStore"
import { useUserStore } from "../../store/userStore"
import useOutsideClick from "../../hooks/useOutsideClick"
import { useChatStore } from "../../store/chatStore"
import whatsappImage from "../../images/whatsapp_image.png"
import { Link } from "react-router-dom"
import styles from "../../style/ChatSection_modules/ChatWindow.module.css"
import { Menu, Moon, Plus, Sun, Trash2 } from "lucide-react"

export default function ChatWindow({ selectedContact, setSelectedContact }) {
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileMenu, setShowFileMenu] = useState(false)
  const [filePreview, setFilePreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  // quick actions menu is open or not
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)

  const messagesEndRef = useRef(null) // Scroll to end of the chat
  const emojiPickerRef = useRef(null)
  const fileInputRef = useRef(null) // file picker input (type="file") ref
  const headerMenuRef = useRef(null) // quick actions menu ref
  const headerMenuButtonRef = useRef(null) // quick actions button ref

  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  const user = useUserStore((state) => state.user)
  const isIOnline = useUserStore((state) => state.isIOnline)

  const messages = useChatStore((state) => state.messages)
  const loading = useChatStore((state) => state.loading)
  const sendMessage = useChatStore((state) => state.sendMessage)
  const startTyping = useChatStore((state) => state.startTyping)
  const fetchMessages = useChatStore((state) => state.fetchMessages)
  const fetchConversations = useChatStore((state) => state.fetchConversations)
  const conversations = useChatStore((state) => state.conversations)
  const addReaction = useChatStore((state) => state.addReaction)
  const deleteMessage = useChatStore((state) => state.deleteMessage)
  const typingUsers = useChatStore((state) => state.typingUsers)
  const currentConversation = useChatStore((state) => state.currentConversation)
  const onlineUsers = useChatStore((state) => state.onlineUsers)
  const isChatListOpen = useChatStore((state) => state.isChatListOpen)
  const setChatListOpen = useChatStore((state) => state.setChatListOpen)

  const isDark = theme === "dark"

  const isUserTyping = (userId) => {
    if (
      !currentConversation ||
      !typingUsers.has(currentConversation) ||
      !userId
    ) {
      return false
    }
    return typingUsers.get(currentConversation).has(userId)
  }

  const isUserOnline = (userId) => {
    if (!userId) return false
    return onlineUsers.get(userId)?.isOnline || false
  }

  const getUserLastSeen = (userId) => {
    if (!userId) return null
    return onlineUsers.get(userId)?.lastSeen || null
  }

  // Get online status and last seen
  const online = isUserOnline(selectedContact?._id)
  const lastSeen = getUserLastSeen(selectedContact?._id)
  const isTyping = isUserTyping(selectedContact?._id)

  useEffect(() => {
    if (selectedContact?._id && conversations?.data?.length > 0) {
      const conversation = conversations.data.find((conv) =>
        conv.participants.some(
          (participant) => participant._id === selectedContact._id,
        ),
      )
      if (conversation?._id) {
        fetchMessages(conversation._id)
      }
    }
  }, [selectedContact, conversations])

  useEffect(() => {
    fetchConversations()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (message && selectedContact) {
      startTyping(selectedContact._id)
    }
  }, [message, selectedContact])

  useOutsideClick(emojiPickerRef, () => {
    if (showEmojiPicker) setShowEmojiPicker(false)
  })

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        headerMenuRef.current &&
        !headerMenuRef.current.contains(event.target) &&
        headerMenuButtonRef.current &&
        !headerMenuButtonRef.current.contains(event.target)
      ) {
        setIsHeaderMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setShowFileMenu(false)
      if (file.type.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(file))
      }
    }
  }

  const handleSendMessage = async () => {
    if (!selectedContact) return
    setFilePreview(null)
    try {
      if (!message.trim() && !selectedFile) return

      const formData = new FormData() // form data is a special javascript object which used to store form data in key value pairs and send to the server

      formData.append("senderId", user._id)
      formData.append("receiverId", selectedContact._id)

      const status = online ? "delivered" : "send"
      formData.append("messageStatus", status)

      if (message.trim()) {
        formData.append("content", message.trim())
      }

      // If there's a file, include that too
      if (selectedFile) {
        formData.append("media", selectedFile)
      }

      await sendMessage(formData)

      // Clear inputs after sending
      setMessage("")
      setSelectedFile(null)
      setFilePreview(null)
      setShowFileMenu(false)
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date)
  }

  const renderDateSeparator = (date) => {
    if (!isValidDate(date)) {
      console.error("Invalid date:", date)
      return null
    }

    let dateString
    if (isToday(date)) {
      dateString = "Today"
    } else if (isYesterday(date)) {
      dateString = "Yesterday"
    } else {
      dateString = format(date, "EEEE, MMMM d")
    }

    return (
      <div className={styles.dateSeparatorWrapper}>
        <span
          className={`${styles.dateSeparatorBadge} ${
            isDark ? styles.dark : ""
          }`}
        >
          {dateString}
        </span>
      </div>
    )
  }

  // Group messages by date
  const groupedMessages = Array.isArray(messages)
    ? messages.reduce((acc, message) => {
        if (!message.createdAt) return acc

        const date = new Date(message.createdAt)
        if (isValidDate(date)) {
          const dateString = format(date, "yyyy-MM-dd")
          if (!acc[dateString]) {
            acc[dateString] = []
          }
          acc[dateString].push(message)
        } else {
          console.error("Invalid date for message:", message)
        }
        return acc
      }, {})
    : {}

  const handleReaction = (messageId, emoji) => {
    addReaction(messageId, emoji)
  }

  if (!selectedContact) {
    return (
      <div className={styles.mainChatArea}>
        <div className={styles.chatHeader}>
          <div className={styles.headerLeft}>
            <button
              className={styles.menuToggleBtn}
              onClick={() => setChatListOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className={styles.botAvatar}>
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="profile_picture"
                  className={styles.userAvatar}
                />
              ) : (
                user?.username?.[0]?.toUpperCase() || "U"
              )}
            </div>
            <div>
              <h2 className={styles.headerTitle}>{user?.username || "User"}</h2>
              <div className={styles.statusGroup}>
                <span
                  className={
                    isIOnline
                      ? styles.statusIndicatorActiveHeader
                      : styles.statusIndicator
                  }
                ></span>
                <span className={styles.statusText}>
                  {isIOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.headerRight}>
            <span className={styles.quickActionsLabel}>Quick actions</span>
            <button
              ref={headerMenuButtonRef}
              onClick={() => setIsHeaderMenuOpen((prev) => !prev)}
              className={`${styles.moreMenuBtn} ${isHeaderMenuOpen ? styles.moreMenuBtnActive : ""}`}
              title="More"
            >
              <div className={styles.moreIconWrapper}>
                <span className={styles.moreDots}>...</span>
              </div>
            </button>

            {isHeaderMenuOpen && (
              <div ref={headerMenuRef} className={styles.headerMenu}>
                <button
                  onClick={() => {
                    setIsHeaderMenuOpen(false)
                  }}
                  className={styles.menuItem}
                >
                  <div className={styles.menuIconContainer}>
                    <Plus size={14} />
                  </div>
                  Add New Friend
                </button>

                <button
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark")
                    setIsHeaderMenuOpen(false)
                  }}
                  className={styles.menuItem}
                >
                  <div className={styles.menuIconContainerSecondary}>
                    {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                  </div>
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </button>
              </div>
            )}
          </div>
        </div>
        <div
          className={`${styles.messagesContainer} ${styles.customScrollbar}`}
        >
          <div className={styles.emptyChatContainer}>
            <h2 className={styles.emptyHeading}>Start a Conversation</h2>
            <p className={styles.emptySubtitle}>
              Send your first message and start chatting in real time.
            </p>

            <div className={styles.actionGrid}>
              {[
                {
                  icon: PiHandWavingBold,
                  label: "Say Hello",
                  sub: "Start with a simple hello",
                  colorClass: styles.colorBrand,
                },
                {
                  icon: IoChatbubbles,
                  label: "Start a Chat",
                  sub: "Ask something and get talking",
                  colorClass: styles.colorBrand2,
                },
                {
                  icon: BsStars,
                  label: "Share an Idea",
                  sub: "Tell them what's on your mind",
                  colorClass: styles.colorBrand,
                },
                {
                  icon: FaRegSmileBeam,
                  label: "Send a Greeting",
                  sub: "Make their day a little brighter",
                  colorClass: styles.colorBrand2,
                },
              ].map((action, i) => (
                <button key={i} className={styles.actionCard}>
                  <div className={styles.actionCardTop}>
                    <div className={styles.actionIconBox}>
                      <action.icon size={20} className={action.colorClass} />
                    </div>
                    <span className={styles.actionCardTitle}>
                      {action.label}
                    </span>
                  </div>
                  <div className={styles.actionCardSub}>{action.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.chatContainer}>
      <div className={`${styles.header} ${isDark ? styles.dark : ""}`}>
        <button
          className={styles.backButton}
          onClick={() => setSelectedContact(null)}
        >
          <FaArrowLeft className={styles.backIcon} />
        </button>
        <img
          src={
            selectedContact?.profilePicture ||
            "/placeholder.svg?height=40&width=40"
          }
          alt={selectedContact?.username}
          className={styles.avatar}
        />
        <div className={styles.headerInfo}>
          <h2 className={styles.username}>{selectedContact?.username}</h2>

          {isTyping ? (
            <div>Typing...</div>
          ) : (
            <p className={`${styles.statusText} ${isDark ? styles.dark : ""}`}>
              {online
                ? "Online"
                : lastSeen
                  ? `Last seen ${format(new Date(lastSeen), "HH:mm")}`
                  : "Offline"}
            </p>
          )}
        </div>

        <div className={styles.headerActions}>
          <button className={styles.iconButton}>
            <FaVideo className={styles.headerIcon} />
          </button>
          <button className={styles.iconButton}>
            <FaEllipsisV className={styles.headerIcon} />
          </button>
        </div>
      </div>

      <div
        className={`${styles.messagesContainer} ${isDark ? styles.dark : ""}`}
      >
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {renderDateSeparator(new Date(date))}
            {msgs
              .filter(
                (msg) =>
                  msg.conversation === selectedContact?.conversation?._id,
              )
              .map((msg) => (
                <MessageBubble
                  key={msg._id || msg.tempId}
                  message={msg}
                  theme={theme}
                  currentUser={user}
                  onReact={handleReaction}
                  deleteMessage={deleteMessage}
                />
              ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {filePreview && (
        <div className={styles.filePreviewContainer}>
          <img
            src={filePreview}
            alt="File preview"
            className={styles.filePreviewImage}
          />
          <button
            onClick={() => {
              setSelectedFile(null)
              setFilePreview(null)
            }}
            className={styles.removeFileButton}
          >
            <FaTimes className={styles.closeIcon} />
          </button>
        </div>
      )}

      <div className={`${styles.footer} ${isDark ? styles.dark : ""}`}>
        <button
          className={styles.iconButton}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <FaSmile
            className={`${styles.footerIcon} ${isDark ? styles.dark : ""}`}
          />
        </button>

        {showEmojiPicker && (
          <div ref={emojiPickerRef} className={styles.emojiPickerContainer}>
            <EmojiPicker
              onEmojiClick={(emojiObject) => {
                setMessage((prev) => prev + emojiObject.emoji)
                setShowEmojiPicker(false)
              }}
              theme={theme}
            />
          </div>
        )}

        <div className={styles.attachmentWrapper}>
          <button
            className={styles.iconButton}
            onClick={() => setShowFileMenu(!showFileMenu)}
          >
            <FaPaperclip
              className={`${styles.footerIcon} ${isDark ? styles.dark : ""}`}
            />
          </button>

          {showFileMenu && (
            <div className={`${styles.fileMenu} ${isDark ? styles.dark : ""}`}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className={styles.hiddenInput}
                accept="image/*,video/*,audio/*,application/*"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`${styles.fileMenuItem} ${
                  isDark ? styles.dark : ""
                }`}
              >
                <FaImage className={styles.menuIcon} /> Image/Video
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`${styles.fileMenuItem} ${
                  isDark ? styles.dark : ""
                }`}
              >
                <FaFile className={styles.menuIcon} /> Document
              </button>
            </div>
          )}
        </div>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage()
            }
          }}
          placeholder="Type a message"
          className={`${styles.messageInput} ${isDark ? styles.dark : ""}`}
        />

        <button className={styles.sendButton} onClick={handleSendMessage}>
          <FaPaperPlane className={styles.sendIcon} />
        </button>
      </div>
    </div>
  )
}
