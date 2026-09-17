import { useEffect, useState } from "react"
import Layout from "./Layout"
import ChatList from "../page/ChatSection/ChatList"
import { getAllUsers } from "../services/user.service"
import { useChatStore } from "../store/chatStore"
import styles from "../style/components_modules/HomePage.module.css"
import { useErrorStore } from "../store/errorStore"

export default function HomeScreen() {
  const messages = useChatStore((state) => state.messages) // if messages state will change then refetch all the users
  const [allUsers, setAllUsers] = useState([]) // Passed to ChatList component
  const setError = useErrorStore((state) => state.setError)

  const getUsers = async () => {
    try {
      const result = await getAllUsers()
      if (result.status === "success") {
        setAllUsers(result.data)
      }
    } catch (error) {
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error.response?.data?.message || error.message)
        console.dir(error)
      }
      setError(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    getUsers()
  }, [messages])

  return (
    <Layout>
      <div className={styles.children}>
        <ChatList contacts={allUsers} />
      </div>
    </Layout>
  )
}
