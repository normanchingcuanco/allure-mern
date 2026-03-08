import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {

    e.preventDefault()

    try {

      const res = await api.post("/auth/login", {
        email,
        password
      })

      console.log("LOGIN RESPONSE:", res.data)

      const userId =
        res.data.user?._id ||
        res.data.user?.id ||
        res.data.userId ||
        res.data.id

      const token = res.data.token

      if (!userId || !token) {
        throw new Error("Invalid login response structure")
      }

      login(userId, token)

      navigate("/discover")

    } catch (err) {

      console.error(err)
      alert("Login failed")

    }

  }

  return (
    <div>

      <h1>Login</h1>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  )
}