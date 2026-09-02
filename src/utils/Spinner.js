import React from "react"
import { motion } from "framer-motion"
import { FaSpinner } from "react-icons/fa"
import styles from "../style/utils_modules/Spinner.module.css"

export default function Spinner({ size = "medium", color = "light" }) {
  const sizeClasses = {
    small: styles.sizeSmall,
    medium: styles.sizeMedium,
    large: styles.sizeLarge,
  }

  const colorClasses = {
    light: styles.colorLight,
    dark: styles.colorDark,
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={`${sizeClasses[size]} ${colorClasses[color]} ${styles.spinnerWrapper}`}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      >
        <FaSpinner />
      </motion.div>
      <span className={`${colorClasses[color]} ${styles.text}`}>
        Loading...
      </span>
    </div>
  )
}
