import React, { useEffect, useState } from "react"
import { FaCamera, FaPencilAlt, FaCheck, FaSmile } from "react-icons/fa"
import { MdCancel } from "react-icons/md"
import Layout from "./Layout"
import EmojiPicker from "emoji-picker-react"
import { useThemeStore } from "../store/themeStore"
import { useUserStore } from "../store/userStore"
import { updateUserProfile } from "../services/user.service"
import { toast } from "react-toastify"
import styles from "../style/components_modules/UserDetails.module.css"
import { X } from "lucide-react"
import { useChatStore } from "../store/chatStore"

export default function UserDetails() {
  const [name, setName] = useState("")
  const [about, setAbout] = useState("Hey there! I am using WhatsApp.")
  const [profileImage, setProfileImage] = useState(null)
  const [preview, setPreview] = useState(null)

  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [showNameEmoji, setShowNameEmoji] = useState(false)
  const [showAboutEmoji, setShowAboutEmoji] = useState(false)

  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const theme = useThemeStore((state) => state.theme)

  const isChatListOpen = useChatStore((state) => state.isChatListOpen)
  const setChatListOpen = useChatStore((state) => state.setChatListOpen)

  useEffect(() => {
    if (user) {
      setName(user.username || "")
      setAbout(user.about || "")
    }
  }, [user])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setProfileImage(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async (field) => {
    try {
      const formData = new FormData()
      if (field === "name") {
        formData.append("username", name)
        setIsEditingName(false)
        setShowNameEmoji(false)
      } else if (field === "about") {
        formData.append("about", about)
        setIsEditingAbout(false)
        setShowAboutEmoji(false)
      }
      if (profileImage && field === "profile") {
        formData.append("media", profileImage)
      }

      const updated = await updateUserProfile(formData)
      setUser(updated.data)
      setProfileImage(null)
      setPreview(null)
      toast.success("Profile updated")
    } catch (err) {
      toast.error(err.message || "Failed to update")
    }
  }

  const handleEmojiSelect = (emoji, field) => {
    if (field === "name") {
      setName((prev) => prev + emoji.emoji)
      setShowNameEmoji(false)
    } else {
      setAbout((prev) => prev + emoji.emoji)
      setShowAboutEmoji(false)
    }
  }

  return (
    <Layout>
      <div
        className={`${styles.profilePage} ${
          theme === "dark" ? styles.darkTheme : styles.lightTheme
        } ${isChatListOpen ? styles.profilePageOpen : ""}`}
      >
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1 className={styles.title}>Profile</h1>
            <button
              className={styles.closeProfilePageBtn}
              onClick={() => setChatListOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          <div className={styles.spaceY}>
            <div className={styles.profileImageSection}>
              <div className={styles.avatarWrapper}>
                <img
                  src={preview || user?.profilePicture}
                  alt="Profile Picture"
                  className={styles.profileImage}
                />
                <label htmlFor="profileUpload" className={styles.overlayLabel}>
                  <div className={styles.overlayContent}>
                    <FaCamera className={styles.cameraIcon} />
                    <span className={styles.changeText}>Change</span>
                  </div>
                  <input
                    type="file"
                    id="profileUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.hiddenInput}
                  />
                </label>
              </div>
            </div>
            {preview && (
              <div className={styles.actionButtons}>
                <button
                  onClick={() => {
                    handleSave("profile")
                  }}
                  className={styles.btnSave}
                >
                  Change
                </button>
                <button
                  onClick={() => {
                    setProfileImage(null)
                    setPreview(null)
                  }}
                  className={styles.btnDiscard}
                >
                  Discard
                </button>
              </div>
            )}

            <div
              className={`${styles.card} ${
                theme === "dark" ? styles.cardDark : styles.cardLight
              }`}
            >
              <label htmlFor="name" className={styles.fieldLabel}>
                Your Name
              </label>
              <div className={styles.fieldRow}>
                {isEditingName ? (
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${styles.textInput} ${
                      theme === "dark" ? styles.inputDark : styles.inputLight
                    }`}
                  />
                ) : (
                  <span className={styles.textDisplay}>
                    {user?.username || name}
                  </span>
                )}
                {isEditingName ? (
                  <>
                    <button
                      onClick={() => handleSave("name")}
                      className={styles.iconBtn}
                    >
                      <FaCheck className={styles.iconCheck} />
                    </button>
                    <button
                      onClick={() => setShowNameEmoji(!showNameEmoji)}
                      className={styles.iconBtn}
                    >
                      <FaSmile className={styles.iconSmile} />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false)
                        setShowNameEmoji(false)
                      }}
                      className={styles.iconBtn}
                    >
                      <MdCancel className={styles.iconCancel} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className={styles.iconBtn}
                  >
                    <FaPencilAlt className={styles.iconPencil} />
                  </button>
                )}
              </div>
              {showNameEmoji && (
                <div className={styles.emojiPickerName}>
                  <EmojiPicker
                    onEmojiClick={(emoji) => handleEmojiSelect(emoji, "name")}
                  />
                </div>
              )}
            </div>

            <div
              className={`${styles.card} ${
                theme === "dark" ? styles.cardDark : styles.cardLight
              }`}
            >
              <label htmlFor="about" className={styles.fieldLabel}>
                About
              </label>
              <div className={styles.fieldRow}>
                {isEditingAbout ? (
                  <input
                    id="about"
                    type="text"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className={`${styles.textInput} ${
                      theme === "dark" ? styles.inputDark : styles.inputLight
                    }`}
                  />
                ) : (
                  <span className={styles.textDisplay}>{about}</span>
                )}
                {isEditingAbout ? (
                  <>
                    <button
                      onClick={() => handleSave("about")}
                      className={styles.iconBtn}
                    >
                      <FaCheck className={styles.iconCheck} />
                    </button>
                    <button
                      onClick={() => setShowAboutEmoji(!showAboutEmoji)}
                      className={styles.iconBtn}
                    >
                      <FaSmile className={styles.iconSmile} />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingAbout(false)
                        setShowAboutEmoji(false)
                      }}
                      className={styles.iconBtn}
                    >
                      <MdCancel className={styles.iconCancel} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditingAbout(true)}
                    className={styles.iconBtn}
                  >
                    <FaPencilAlt className={styles.iconPencil} />
                  </button>
                )}
              </div>
              {showAboutEmoji && (
                <div className={styles.emojiPickerAbout}>
                  <EmojiPicker
                    onEmojiClick={(emoji) => handleEmojiSelect(emoji, "about")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
