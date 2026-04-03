import { useEffect, useState } from "react"
import api from "../api/axios"

export default function AccountSettings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: ""
  })

  const [msg, setMsg] = useState("")
  const [error, setError] = useState("")
  const [verificationMsg, setVerificationMsg] = useState("")
  const [verificationError, setVerificationError] = useState("")
  const [loadingVerification, setLoadingVerification] = useState(false)

  const [accountInfo, setAccountInfo] = useState({
    email: "",
    role: "",
    isAdmin: false,
    isVerified: false
  })

  const userId = localStorage.getItem("userId")
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        let email = ""
        let role = ""
        let isAdmin = false

        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]))
          email = payload.email || ""
          role = payload.role || "user"
          isAdmin = payload.isAdmin || false
        }

        let isVerified = false

        if (userId) {
          const profileRes = await api.get(`/profiles/user/${userId}`)
          isVerified = profileRes.data?.isVerified || false
        }

        setAccountInfo({
          email,
          role,
          isAdmin,
          isVerified
        })
      } catch (err) {
        console.error(err)
      }
    }

    fetchAccountInfo()
  }, [userId, token])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    try {
      const res = await api.put("/auth/change-password", {
        userId,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      })

      setMsg(res.data.message)
      setError("")
      setForm({
        currentPassword: "",
        newPassword: ""
      })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password")
      setMsg("")
    }
  }

  const handleResendVerification = async () => {
    try {
      setLoadingVerification(true)
      setVerificationMsg("")
      setVerificationError("")

      const res = await api.post("/auth/resend-verification", {
        email: accountInfo.email
      })

      setVerificationMsg(res.data.message || "Verification email sent")
    } catch (err) {
      setVerificationError(err.response?.data?.message || "Failed to resend verification")
    } finally {
      setLoadingVerification(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This cannot be undone.")

    if (!confirmDelete) return

    try {
      await api.delete(`/profiles/account/${userId}`)

      localStorage.clear()
      window.location.href = "/login"
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete account")
    }
  }

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Account Settings</h2>

      <div style={{ marginBottom: "20px" }}>
        <h4>Account Info</h4>
        <p><strong>Email:</strong> {accountInfo.email || "—"}</p>
        <p><strong>Role:</strong> {accountInfo.role || "user"}</p>
        <p><strong>Admin:</strong> {accountInfo.isAdmin ? "Yes" : "No"}</p>
        <p><strong>Verification:</strong> {accountInfo.isVerified ? "Verified ✅" : "Not Verified"}</p>

        {!accountInfo.isVerified && accountInfo.email && (
          <div style={{ marginTop: "10px" }}>
            <button onClick={handleResendVerification} disabled={loadingVerification}>
              {loadingVerification ? "Sending..." : "Resend Verification"}
            </button>

            {verificationMsg && <p style={{ color: "green" }}>{verificationMsg}</p>}
            {verificationError && <p style={{ color: "red" }}>{verificationError}</p>}
          </div>
        )}
      </div>

      <form onSubmit={handleChangePassword}>
        <h4>Change Password</h4>

        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          required
        />

        <br /><br />

        <button type="submit">Update Password</button>
      </form>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      <div>
        <h4>Danger Zone</h4>
        <button
          onClick={handleDeleteAccount}
          style={{ background: "red", color: "white" }}
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}