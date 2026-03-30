import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {

  const [userId, setUserId] = useState(localStorage.getItem("userId"))
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin"))

  const login = (userId, token, isAdmin = false) => {
    localStorage.setItem("userId", userId)
    localStorage.setItem("token", token)
    localStorage.setItem("isAdmin", String(isAdmin))

    setUserId(userId)
    setToken(token)
    setIsAdmin(String(isAdmin))
  }

  const logout = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("token")
    localStorage.removeItem("isAdmin")

    setUserId(null)
    setToken(null)
    setIsAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ userId, token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}