import React, { useState, useRef } from "react"
import { FaPlus, FaSmile } from "react-icons/fa"
import { format } from "date-fns"
import EmojiPicker from "emoji-picker-react"
import useOutsideClick from "../../hooks/useOutsideClick"
import { FaCheck, FaCheckDouble } from "react-icons/fa"
import { RxCross2 } from "react-icons/rx"
import { HiDotsVertical } from "react-icons/hi"
import { FaTrashAlt, FaRegCopy } from "react-icons/fa"
import styles from "../../style/ChatSection_modules/MessageBubble.module.css"

const MessageBubble = ({
  message,
  theme,
  onReact,
  currentUser,
  deleteMessage,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showReactions, setShowReactions] = useState(false) // To show quick reactions bar
  const [showOptions, setShowOptions] = useState(false) // To show message copy and delete options

  const optionsRef = useRef(null) // Message copy and delete btn container ref
  const emojiPickerRef = useRef(null)
  const reactionsMenuRef = useRef(null) // Quick reactions container ref

  const isDark = theme === "dark"
  const isUserMessage = message.sender._id === currentUser._id

  const bubbleClass = isUserMessage ? styles.chatEnd : styles.chatStart

  const bubbleThemeClass = isUserMessage
    ? `${styles.userBubble} ${isDark ? styles.dark : ""}`
    : `${styles.otherBubble} ${isDark ? styles.dark : ""}`

  const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "🙏"]

  const handleReact = (emoji) => {
    onReact(message._id, emoji)
    setShowEmojiPicker(false)
    setShowReactions(false)
  }

  useOutsideClick(emojiPickerRef, () => {
    if (showEmojiPicker) setShowEmojiPicker(false)
  })

  useOutsideClick(reactionsMenuRef, () => {
    if (showReactions) setShowReactions(false)
  })

  useOutsideClick(optionsRef, () => {
    if (showOptions) setShowOptions(false)
  })

  if (message === 0) return null

  return (
    <div className={`${styles.chat} ${bubbleClass}`}>
      <div className={`${styles.bubble} ${bubbleThemeClass}`}>
        <div className={styles.messageContentWrapper}>
          {message.contentType === "text" && (
            <p className={styles.textContent}>{message.content}</p>
          )}
          {message.contentType === "image" && (
            <div>
              <img
                src={message.imageOrVideoUrl}
                alt="Shared image"
                className={styles.mediaImage}
              />
              <p className={styles.mediaCaption}>{message.content}</p>
            </div>
          )}
          {message.contentType === "video" && (
            <div>
              <video controls className={styles.mediaVideo}>
                <source src={message.imageOrVideoUrl} />
              </video>
              <p className={styles.mediaCaption}>{message.content}</p>
            </div>
          )}
          {message.contentType === "audio" && (
            <div>
              <audio controls className={styles.mediaAudio}>
                <source src={message.imageOrVideoUrl} />
              </audio>
              <p className={styles.mediaCaption}>{message.content}</p>
            </div>
          )}
        </div>

        <div className={styles.metaContainer}>
          <span>{format(new Date(message.createdAt), "HH:mm")}</span>
          {isUserMessage && (
            <>
              {message.messageStatus === "send" && <FaCheck size={12} />}
              {message.messageStatus === "delivered" && (
                <FaCheckDouble size={12} />
              )}
              {message.messageStatus === "read" && (
                <FaCheckDouble size={12} className={styles.readCheck} />
              )}
            </>
          )}
        </div>

        {/* 3-dot options menu icon - shows on hover */}
        <div className={styles.optionsButtonWrapper}>
          <button
            onClick={() => setShowOptions((prev) => !prev)}
            className={`${styles.iconCircleButton} ${
              isDark ? styles.dark : ""
            }`}
          >
            <HiDotsVertical size={18} />
          </button>
        </div>

        <div
          className={`${styles.reactionTriggerWrapper} ${
            isUserMessage ? styles.leftSide : styles.rightSide
          }`}
        >
          <button
            onClick={() => setShowReactions(!showReactions)}
            className={`${styles.smileButton} ${isDark ? styles.dark : ""}`}
          >
            <FaSmile
              className={`${styles.smileIcon} ${isDark ? styles.dark : ""}`}
            />
          </button>
        </div>

        {showReactions && (
          <div
            ref={reactionsMenuRef}
            className={`${styles.reactionsMenu} ${
              isUserMessage ? styles.userLeft : styles.otherLeft
            }`}
          >
            {quickReactions.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleReact(emoji)}
                className={styles.emojiItemButton}
              >
                {emoji}
              </button>
            ))}
            <div className={styles.reactionsDivider} />
            <button
              onClick={() => setShowEmojiPicker(true)}
              className={styles.addReactionButton}
            >
              <FaPlus className={styles.plusIcon} />
            </button>
          </div>
        )}

        {showEmojiPicker && (
          <div ref={emojiPickerRef} className={styles.emojiPickerPopover}>
            <div className={styles.pickerRelative}>
              <EmojiPicker
                onEmojiClick={(emojiObject) => handleReact(emojiObject.emoji)}
                theme={theme}
              />
              <button
                onClick={() => setShowEmojiPicker(false)}
                className={styles.closePickerButton}
              >
                <RxCross2 />
              </button>
            </div>
          </div>
        )}

        {message.reactions && message.reactions.length > 0 && (
          <div
            className={`${styles.reactionsBadge} ${
              isUserMessage ? styles.userRight : styles.otherLeft
            } ${isDark ? styles.dark : ""}`}
          >
            {message.reactions.map((reaction, index) => (
              <span key={index} className={styles.reactionEmoji}>
                {reaction.emoji}
              </span>
            ))}
          </div>
        )}

        {showOptions && (
          <div
            ref={optionsRef}
            className={`${styles.optionsMenu} ${isDark ? styles.dark : ""}`}
          >
            {/* Copy Button */}
            <button
              onClick={() => {
                if (message.content) {
                  navigator.clipboard.writeText(message.content)
                }
                setShowOptions(false)
              }}
              className={styles.optionItem}
            >
              <FaRegCopy size={14} />
              <span>Copy</span>
            </button>

            {/* Delete Button */}
            {isUserMessage && (
              <button
                onClick={() => {
                  deleteMessage(message._id)
                  setShowOptions(false)
                }}
                className={`${styles.optionItem} ${styles.deleteText}`}
              >
                <FaTrashAlt className={styles.deleteIcon} size={14} />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBubble
