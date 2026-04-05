import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/axios"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [gender, setGender] = useState("")
  const [loading, setLoading] = useState(false)
  const [verificationToken, setVerificationToken] = useState("")
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!email || !password || !gender) {
      alert("Email, password, and gender are required")
      return
    }

    try {
      setLoading(true)
      setVerificationToken("")
      setRegisteredEmail("")
      setSuccessMessage("")

      const res = await api.post("/auth/register", {
        email,
        password,
        gender
      })

      const token = res.data?.verificationToken || ""

      setVerificationToken(token)
      setRegisteredEmail(email)
      setSuccessMessage("Registration successful. Verify your email before logging in.")

      if (token) {
        navigate(`/verify-email/${token}`, {
          state: {
            email,
            verificationToken: token
          }
        })
        return
      }

      alert("Registered successfully, but no verification token was returned.")
      navigate("/login")
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
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

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {successMessage && (
        <>
          <br />
          <p>{successMessage}</p>
        </>
      )}

      {registeredEmail && (
        <>
          <p>Email: {registeredEmail}</p>
        </>
      )}

      {verificationToken && (
        <>
          <p>Verification token: {verificationToken}</p>
          <p>
            Verify now:{" "}
            <Link to={`/verify-email/${verificationToken}`}>
              Open verification page
            </Link>
          </p>
        </>
      )}

      <br />

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}