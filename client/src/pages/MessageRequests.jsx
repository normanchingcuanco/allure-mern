import { useEffect, useState } from "react"
import axios from "axios"

export default function MessageRequests() {
  const [requests, setRequests] = useState([])

  const userId = localStorage.getItem("userId")

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/message-requests/incoming/${userId}`
    )

    setRequests(res.data)
  }

  const acceptRequest = async (id) => {
    await axios.patch(
      `http://localhost:5000/api/message-requests/accept/${id}`
    )

    setRequests(requests.filter(r => r._id !== id))
  }

  const rejectRequest = async (id) => {
    await axios.patch(
      `http://localhost:5000/api/message-requests/reject/${id}`
    )

    setRequests(requests.filter(r => r._id !== id))
  }

  return (
    <div>
      <h2>Message Requests</h2>

      {requests.length === 0 && <p>No message requests</p>}

      {requests.map((request) => (
        <div key={request._id} style={{border:"1px solid #ccc", padding:"10px", marginBottom:"10px"}}>
          <p><strong>From:</strong> {request.sender?.email}</p>
          <p>{request.message}</p>

          <button onClick={() => acceptRequest(request._id)}>
            Accept
          </button>

          <button onClick={() => rejectRequest(request._id)}>
            Reject
          </button>
        </div>
      ))}
    </div>
  )
}