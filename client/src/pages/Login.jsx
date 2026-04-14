import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [resendEmail, setResendEmail] = useState("")
  const [resendMessage, setResendMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await api.post("/auth/login", {
        email,
        password
      })

      const data = res.data

      // 🔥 FIX: normalize values
      const userData = {
        token: data.token,
        userId: data.userId,
        isAdmin: String(data.isAdmin) // ensure "true"/"false"
      }

      login(userData)

      // 🔥 navigate based on role
      if (data.isAdmin) {
        navigate("/admin/reports")
      } else {
        navigate("/discover")
      }

    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Login failed")
    }
  }

  const handleResendVerification = async (e) => {
    e.preventDefault()

    try {
      const res = await api.post("/auth/resend-verification", {
        email: resendEmail
      })

      setResendMessage(
        res.data.message || `Verification token: ${res.data.verificationToken}`
      )
    } catch (err) {
      console.error(err)
      setResendMessage(
        err.response?.data?.message || "Failed to resend verification"
      )
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

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <br />

      <p>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>

      <br /><br />

      <h3>Didn’t receive verification email?</h3>

      <form onSubmit={handleResendVerification}>
        <input
          type="email"
          placeholder="Enter your email"
          value={resendEmail}
          onChange={(e) => setResendEmail(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Resend Verification
        </button>
      </form>

      {resendMessage && (
        <>
          <br />
          <p>{resendMessage}</p>
        </>
      )}
    </div>
  )
}