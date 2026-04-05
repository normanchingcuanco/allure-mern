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
      setLoading(true)

      const res = await api.post("/auth/login", {
        email,
        password
      })

      console.log("LOGIN RESPONSE:", res.data)
      console.log("LOGIN isAdmin:", res.data.isAdmin)
      console.log("LOGIN email:", res.data.email)
      console.log("LOGIN userId:", res.data.userId)

      const userId =
        res.data.user?._id ||
        res.data.user?.id ||
        res.data.userId ||
        res.data.id

      const token = res.data.token
      const isAdmin = Boolean(res.data.isAdmin)

      if (!userId || !token) {
        throw new Error("Invalid login response structure")
      }

      login(userId, token, isAdmin)

      if (isAdmin) {
        navigate("/discover")
        return
      }

      try {
        await api.get(`/profiles/user/${userId}`)
        navigate("/discover")
      } catch (error) {
        if (error.response?.status === 404) {
          navigate("/create-profile")
          return
        }

        console.error("Profile check failed:", error)
        alert(error.response?.data?.message || "Unable to complete login routing")
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
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