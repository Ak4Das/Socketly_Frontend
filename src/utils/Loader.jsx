import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Socketly_icon from "../assets/images/favicon.svg"
import styles from "../style/utils_modules/Loader.module.css"

export default function Loader({ progress = 0 }) {
  const [progressDone, setProgressDone] = useState(progress)
  const motionDiv = useRef()
  useEffect(() => {
    const timerId = setInterval(() => {
      const done = Number(motionDiv.current?.style.width.replace("%", ""))
      setProgressDone(Math.floor(done))
    }, 100)

    return () => {
      clearInterval(timerId)
    }
  }, [])
  return (
    <div className={styles.container}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5, // animation will stay 0.5 seconds long
          type: "spring",
          stiffness: 300, // controls how strong/stiff the spring is (higher stiffness → faster spring, lower stiffness → slower spring)
          damping: 20, // controls spring's bouncing (lower number means higher bouncing)
        }}
        className={styles.logoContainer}
      >
        <img src={Socketly_icon} alt="socketly_icon" />
      </motion.div>
      <div className={styles.progressTrack}>
        <motion.div
          className={styles.progressBar}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ delay: 1, duration: 1.5 }}
          ref={motionDiv}
        />
      </div>
      <p className={styles.progressText}>Loading... {progressDone}%</p>
    </div>
  )
}
