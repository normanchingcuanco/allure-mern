import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"

export default function AdminVerification() {

  const navigate = useNavigate()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)

  const isAdmin = localStorage.getItem("isAdmin") === "true"

  useEffect(() => {
    if (!isAdmin) {
      alert("Unauthorized access")
      navigate("/discover")
      return
    }

    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await api.get("/verification-requests/pending")
      setRequests(res.data)
    } catch (error) {
      console.error(error)
      alert("Failed to load verification requests")
    } finally {
      setLoading(false)
    }
  }

  const approveRequest = async (id) => {
    try {
      setProcessingId(id)

      await api.patch(`/verification-requests/approve/${id}`, {
        reviewedBy: localStorage.getItem("userId")
      })

      alert("Approved")
      fetchRequests()
    } catch (error) {
      console.error(error)
      alert("Failed to approve")
    } finally {
      setProcessingId(null)
    }
  }

  const rejectRequest = async (id) => {
    const reason = prompt("Enter rejection reason:")
    if (!reason) return

    try {
      setProcessingId(id)

      await api.patch(`/verification-requests/reject/${id}`, {
        reviewedBy: localStorage.getItem("userId"),
        rejectionReason: reason
      })

      alert("Rejected")
      fetchRequests()
    } catch (error) {
      console.error(error)
      alert("Failed to reject")
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <p>Loading verification requests...</p>
      </>
    )
  }

  return (
    <>
      <Navbar />

      <h2>Verification Requests (Admin)</h2>

      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        requests.map((req) => (
          <div
            key={req._id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "8px"
            }}
          >
            <p><strong>User:</strong> {req.userId?.email}</p>
            <p><strong>ID Type:</strong> {req.idType}</p>

            <div>
              <p><strong>ID Image:</strong></p>
              <img src={req.idImageUrl} width="200" />
            </div>

            <div>
              <p><strong>Selfie:</strong></p>
              <img src={req.selfieImageUrl} width="200" />
            </div>

            <br />

            <button
              onClick={() => approveRequest(req._id)}
              disabled={processingId === req._id}
              style={{ marginRight: "10px", background: "green", color: "white" }}
            >
              {processingId === req._id ? "Processing..." : "Approve"}
            </button>

            <button
              onClick={() => rejectRequest(req._id)}
              disabled={processingId === req._id}
              style={{ background: "red", color: "white" }}
            >
              Reject
            </button>
          </div>
        ))
      )}
    </>
  )
}