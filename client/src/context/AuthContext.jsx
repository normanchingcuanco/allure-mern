import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null)
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true")

  const login = (data) => {
    localStorage.setItem("token", data.token)
    localStorage.setItem("userId", data.userId)
    localStorage.setItem("isAdmin", data.isAdmin)

    setToken(data.token)
    setUserId(data.userId)
    setIsAdmin(data.isAdmin)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("isAdmin")

    setToken(null)
    setUserId(null)
    setIsAdmin(false)
  }

  // 🔥 NEW: force logout (used for suspension)
  const forceLogout = () => {
    logout()
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider
      value={{
        userId,
        token,
        isAdmin,
        login,
        logout,
        forceLogout // 👈 expose this
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)