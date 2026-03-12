import { useEffect, useState } from "react"
import api from "../api/axios"
import Navbar from "../components/Navbar"

export default function MessageRequests() {

  const [requests, setRequests] = useState([])
  const userId = localStorage.getItem("userId")

  const fetchRequests = async () => {
    try {

      const res = await api.get(`/message-requests/incoming/${userId}`)
      setRequests(res.data)

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const acceptRequest = async (requestId) => {
    try {

      await api.patch(`/message-requests/${requestId}/accept`)
      fetchRequests()

    } catch (error) {
      console.error(error)
    }
  }

  const rejectRequest = async (requestId) => {
    try {

      await api.patch(`/message-requests/${requestId}/reject`)
      fetchRequests()

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Navbar />

      <h1>Message Requests</h1>

      {requests.length === 0 && (
        <p>No incoming requests</p>
      )}

      {requests.map((req) => (
        <div
          key={req._id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px"
          }}
        >

          <p>
            <strong>From:</strong> {req.sender?.email}
          </p>

          <p>
            <strong>Message:</strong> {req.message}
          </p>

          <button
            onClick={() => acceptRequest(req._id)}
            style={{ marginRight: "10px" }}
          >
            Accept
          </button>

          <button
            onClick={() => rejectRequest(req._id)}
          >
            Reject
          </button>

        </div>
      ))}
    </>
  )
}