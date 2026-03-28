import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios"

export default function VerifyEmail() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    let redirectTimer

    const verifyUserEmail = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`)
        setSuccess(true)

        redirectTimer = setTimeout(() => {
          navigate("/")
        }, 3000)
      } catch (err) {
        console.error("Email verification failed:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      verifyUserEmail()
    } else {
      setError(true)
      setLoading(false)
    }

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer)
    }
  }, [token, navigate])

  return (
    <div style={styles.container}>
      <h2>Email Verification</h2>

      {loading && <p>Verifying your email...</p>}

      {success && (
        <>
          <p style={styles.success}>
            Email verified successfully. Redirecting to login...
          </p>
          <button onClick={() => navigate("/")}>Go to Login Now</button>
        </>
      )}

      {error && (
        <>
          <p style={styles.error}>
            Verification failed or token expired.
          </p>
          <button onClick={() => navigate("/")}>Back to Login</button>
        </>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "80px auto",
    padding: "40px",
    textAlign: "center"
  },
  success: {
    color: "green"
  },
  error: {
    color: "red"
  }
}