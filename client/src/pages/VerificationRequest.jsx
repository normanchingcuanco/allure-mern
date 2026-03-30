import { useEffect, useState } from "react"
import api from "../api/axios"
import Navbar from "../components/Navbar"

export default function VerificationRequest() {
  const userId = localStorage.getItem("userId")

  const [idType, setIdType] = useState("national_id")
  const [idImageUrl, setIdImageUrl] = useState("")
  const [selfieImageUrl, setSelfieImageUrl] = useState("")
  const [requests, setRequests] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const fetchMyRequests = async () => {
    try {
      const res = await api.get(`/verification-requests/mine/${userId}`)
      setRequests(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchMyRequests()
    }
  }, [userId])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!idImageUrl.trim() || !selfieImageUrl.trim()) {
      alert("Please provide both ID image URL and selfie image URL")
      return
    }

    try {
      setSubmitting(true)

      const res = await api.post("/verification-requests", {
        userId,
        idType,
        idImageUrl: idImageUrl.trim(),
        selfieImageUrl: selfieImageUrl.trim()
      })

      alert(res.data.message || "Verification request submitted successfully")

      setIdType("national_id")
      setIdImageUrl("")
      setSelfieImageUrl("")

      fetchMyRequests()
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || "Failed to submit verification request")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />

      <h2>Identity Verification</h2>
      <p>Submit your ID and selfie so your profile can be reviewed for verification.</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label>ID Type</label>
          <br />
          <select value={idType} onChange={(e) => setIdType(e.target.value)}>
            <option value="national_id">National ID</option>
            <option value="passport">Passport</option>
            <option value="drivers_license">Driver's License</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>ID Image URL</label>
          <br />
          <input
            type="text"
            value={idImageUrl}
            onChange={(e) => setIdImageUrl(e.target.value)}
            placeholder="Paste your ID image URL"
            style={{ width: "400px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Selfie Image URL</label>
          <br />
          <input
            type="text"
            value={selfieImageUrl}
            onChange={(e) => setSelfieImageUrl(e.target.value)}
            placeholder="Paste your selfie image URL"
            style={{ width: "400px" }}
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Verification Request"}
        </button>
      </form>

      <hr />

      <h3>My Verification Requests</h3>

      {requests.length === 0 ? (
        <p>No verification requests yet.</p>
      ) : (
        requests.map((request) => (
          <div
            key={request._id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "8px"
            }}
          >
            <p><strong>ID Type:</strong> {request.idType}</p>
            <p><strong>Status:</strong> {request.status}</p>
            <p><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleString()}</p>

            {request.rejectionReason && (
              <p><strong>Rejection Reason:</strong> {request.rejectionReason}</p>
            )}

            <div style={{ marginTop: "10px" }}>
              <p><strong>ID Image:</strong></p>
              <img
                src={request.idImageUrl}
                alt="ID"
                width="220"
                style={{ borderRadius: "8px", marginBottom: "10px" }}
              />
            </div>

            <div>
              <p><strong>Selfie Image:</strong></p>
              <img
                src={request.selfieImageUrl}
                alt="Selfie"
                width="220"
                style={{ borderRadius: "8px" }}
              />
            </div>
          </div>
        ))
      )}
    </>
  )
}