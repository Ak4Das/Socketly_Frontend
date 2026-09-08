import React from "react"
import { useNavigate } from "react-router-dom"
import styles from "../style/Home.module.css"

export default function Home() {
  const navigate = useNavigate()
  const isTokenPresent = localStorage.getItem("auth_token")

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brandWrapper}>
          <div className={styles.logoIcon}>S</div>
          <span className={styles.brandTitle}>Socketly</span>
        </div>
        <button
          className={styles.headerBtn}
          onClick={() => navigate(`${isTokenPresent ? "/" : "/user-login"}`)}
        >
          Start Chat
        </button>
      </header>

      <main className={styles.mainContent}>
        <h1 className={styles.heroTitle}>Your World, Instantly Connected</h1>
        <p className={styles.heroText}>
          Step into a place where conversations happen in real-time. Share
          moments, ideas, and laughter with friends and teams. Experience a
          connection that's seamless, reliable, and always accessible, whenever
          and wherever you are.
        </p>
        <button
          className={styles.getStartedBtn}
          onClick={() => navigate(`${isTokenPresent ? "/" : "/user-login"}`)}
        >
          Get Started Now
        </button>
      </main>
    </div>
  )
}
