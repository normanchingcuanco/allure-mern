import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../api/axios"

export default function VerifyEmail() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let redirectTimer

    const verifyUserEmail = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`)
        setSuccess(true)

        redirectTimer = setTimeout(() => {
          navigate("/login")
        }, 3000)
      } catch (err) {
        console.error("Email verification failed:", err)
        setErrorMessage(
          err.response?.data?.message || "Verification failed or token expired."
        )
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      verifyUserEmail()
    } else {
      setErrorMessage("Missing verification token.")
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

      {!loading && success && (
        <>
          <p style={styles.success}>
            Email verified successfully. Redirecting to login...
          </p>

          <button onClick={() => navigate("/login")}>
            Go to Login Now
          </button>
        </>
      )}

      {!loading && !success && errorMessage && (
        <>
          <p style={styles.error}>{errorMessage}</p>

          <div style={styles.actions}>
            <button onClick={() => navigate("/login")}>
              Back to Login
            </button>

            <Link to="/register">
              Register Again
            </Link>
          </div>
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
    color: "green",
    marginBottom: "16px"
  },
  error: {
    color: "red",
    marginBottom: "16px"
  },
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    alignItems: "center"
  }
}