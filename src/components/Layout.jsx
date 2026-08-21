import React, { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import ChatWindow from "../page/ChatSection/ChatWindow"
import useStore from "../store/layoutStore"
import useThemeStore from "../store/themeStore"
import { useLocation } from "react-router-dom"

export default function Layout({
  children, // Which component i want to render inside layout's children section
  isThemeDialogOpen, // is theme (dark or light) dialog box open from settings page
  toggleThemeDialog, // close theme dialog box function
  isStatusPreviewOpen, // is status preview page open
  statusPreviewContent, // status Content
}) {
  const selectedContact = useStore((state) => state.selectedContact) // To maintain the layout and pass to the chat window component
  const setSelectedContact = useStore((state) => state.setSelectedContact) // pass to the chat window component
  const location = useLocation() // Used to control userDetails page layout only
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768) // Used to control layout in different screen sizes
  const theme = useThemeStore((state) => state.theme) // Used to control styles only
  const setTheme = useThemeStore((state) => state.setTheme) // Used to toggle theme (dark or light)

  const isUserDetailsPage = location.pathname === "/user-details"
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-[#111b21] text-white" : "bg-gray-100 text-black"} flex relative`}
    >
      {!isMobile && <Sidebar />}
      <div
        className={`flex-1 flex overflow-hidden ${isMobile ? "flex-col" : ""}`}
      >
        {(!selectedContact || !isMobile) && (
          <div
            className={`${isUserDetailsPage ? "w-full md:w-2/5" : "w-full md:w-2/5"} h-full ${isMobile ? "pb-16" : ""}`}
          >
            {children}
          </div>
        )}
        {(selectedContact || !isMobile) && (
          <div className="w-full h-full">
            <ChatWindow
              selectedContact={selectedContact}
              setSelectedContact={setSelectedContact}
              isMobile={isMobile}
            />
          </div>
        )}
      </div>
      {isMobile && <Sidebar />}

      {/* Theme Dialog */}
      {isThemeDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`${theme === "dark" ? "bg-[#202c33] text-white" : "bg-white text-black"} p-6 rounded-lg shadow-lg max-w-sm w-full`}
          >
            <h2 className="text-2xl font-semibold mb-4">Choose a theme</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="light"
                  checked={theme === "light"}
                  onChange={() => setTheme("light")}
                  className="form-radio text-blue-600"
                />
                <span>Light</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="dark"
                  checked={theme === "dark"}
                  onChange={() => setTheme("dark")}
                  className="form-radio text-blue-600"
                />
                <span>Dark</span>
              </label>
            </div>
            <button
              onClick={toggleThemeDialog}
              className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Status Preview */}
      {isStatusPreviewOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {statusPreviewContent}
        </div>
      )}
    </div>
  )
}
