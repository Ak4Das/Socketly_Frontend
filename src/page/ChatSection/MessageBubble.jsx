import { useState, useRef } from "react"
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
          {message.contentType.startsWith("image") && (
            <div className={styles.mediaImageContainer}>
              <img
                src={message.documentViewUrl}
                alt="Shared image"
                className={styles.mediaImage}
              />
              {message.content && (
                <p className={styles.mediaCaption}>{message.content}</p>
              )}
            </div>
          )}
          {message.contentType.startsWith("video") && (
            <div className={styles.mediaVideoContainer}>
              <video controls className={styles.mediaVideo}>
                <source src={message.documentViewUrl} />
              </video>
              {message.content && (
                <p className={styles.mediaCaption}>{message.content}</p>
              )}
            </div>
          )}
          {message.contentType.startsWith("audio") && (
            <div className={styles.mediaAudioContainer}>
              <audio controls className={styles.mediaAudio}>
                <source src={message.documentViewUrl} />
              </audio>
              {message.content && (
                <p className={styles.mediaCaption}>{message.content}</p>
              )}
            </div>
          )}
          {message.contentType.startsWith("application") && (
            <div className={styles.mediaDocumentContainer}>
              <div className="d-flex gap-3 align-items-center">
                <div>
                  <svg
                    viewBox="0 0 22 26"
                    width="26"
                    preserveAspectRatio="xMidYMid meet"
                    className=""
                    fill="none"
                  >
                    <title>document-PDF-icon</title>
                    <path
                      fill="red"
                      d="M1 5.8c0-1.68 0-2.52.33-3.16a3 3 0 0 1 1.3-1.31C3.29 1 4.13 1 5.8 1h5.55c.98 0 1.47 0 1.93.11.4.1.8.26 1.15.48.4.25.75.6 1.44 1.28L17 4l2.13 2.13a8.36 8.36 0 0 1 1.28 1.44 4 4 0 0 1 .48 1.15c.11.46.11.95.11 1.93v9.55c0 1.68 0 2.52-.33 3.16a3 3 0 0 1-1.3 1.31c-.65.33-1.49.33-3.17.33H5.8c-1.68 0-2.52 0-3.16-.33a3 3 0 0 1-1.31-1.3C1 22.71 1 21.87 1 20.2V5.8Z"
                    ></path>
                    <path
                      stroke="#fff"
                      strokeOpacity="0.15"
                      strokeWidth="0.5"
                      d="m21.13 8.66-.24.06.24-.06a4.25 4.25 0 0 0-.5-1.22c-.27-.43-.64-.8-1.3-1.46l-.03-.03-2.12-2.13-1.13-1.12-.03-.03a8.16 8.16 0 0 0-1.46-1.3 4.25 4.25 0 0 0-1.23-.5c-.48-.12-1-.12-1.94-.12h-5.6c-.83 0-1.47 0-1.98.04-.52.04-.92.13-1.28.31A3.25 3.25 0 0 0 1.1 2.52C.92 2.9.83 3.3.79 3.81.75 4.32.75 4.96.75 5.79v14.42c0 .83 0 1.47.04 1.98.04.52.13.92.31 1.29a3.25 3.25 0 0 0 1.42 1.42c.37.18.77.27 1.29.3.5.05 1.15.05 1.98.05H16.2c.83 0 1.47 0 1.98-.04.52-.04.92-.13 1.29-.31a3.25 3.25 0 0 0 1.42-1.42c.18-.37.27-.77.3-1.29.05-.5.05-1.15.05-1.98v-9.6c0-.94 0-1.45-.12-1.94Z"
                    ></path>
                    <g filter="url(#WAWebIcDocBaseIcon__a)">
                      <path
                        fill="#fff"
                        fillOpacity="0.4"
                        fillRule="evenodd"
                        d="m20.71 8.1-5.97-.03a1 1 0 0 1-1-1l.03-5.82c.21.09.43.2.63.32.4.24.74.58 1.43 1.26L17 4l2.14 2.13c.7.7 1.06 1.04 1.3 1.45a4 4 0 0 1 .27.51Z"
                        clipRule="evenodd"
                        shapeRendering="crispEdges"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div>
                  <p className="fs-6 my-0">{message.fileName}</p>
                  <p className="fs-6 my-0">{`${message.contentType.split("/")[1]} - ${
                    (message.fileSize / 1048576).toFixed(2) > 1
                      ? `${(message.fileSize / 1048576).toFixed(2)} MiB`
                      : `${(message.fileSize / 1024).toFixed(2)} KiB`
                  }`}</p>
                </div>
              </div>
              {message.content && (
                <p className="mt-3 mb-0">{message.content}</p>
              )}
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
                if (message.content || message.fileName) {
                  navigator.clipboard.writeText(
                    message.content || message.fileName,
                  )
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
        {!message.contentType.startsWith("text") && (
          <div
            className={`d-flex gap-2 mt-2 align-items-center w-100 ${styles.viewOrDownloadSection}`}
          >
            <span
              className={`flex-grow-1 d-flex align-items-center justify-content-center py-2 ${styles.view}`}
              style={{ cursor: "pointer" }}
              onClick={() => window.open(message.documentViewUrl, "_blank")}
            >
              View
            </span>
            <span
              className={`flex-grow-1 d-flex align-items-center justify-content-center py-2 ${styles.download}`}
              style={{ cursor: "pointer" }}
              onClick={() => window.open(message.documentContentUrl)}
            >
              Download
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBubble
