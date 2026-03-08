import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {

  const [userId, setUserId] = useState(localStorage.getItem("userId"))
  const [token, setToken] = useState(localStorage.getItem("token"))

  const login = (userId, token) => {
    localStorage.setItem("userId", userId)
    localStorage.setItem("token", token)

    setUserId(userId)
    setToken(token)
  }

  const logout = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("token")

    setUserId(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ userId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}