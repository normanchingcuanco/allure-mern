import { useEffect, useState } from "react"
import api from "../api/axios"
import Navbar from "../components/Navbar"

export default function MessageRequests() {
  const [incomingRequests, setIncomingRequests] = useState([])
  const [outgoingRequests, setOutgoingRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState("")

  const userId = localStorage.getItem("userId")

  const fetchRequests = async (showLoader = true) => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      if (showLoader) {
        setLoading(true)
      }

      const [incomingRes, outgoingRes] = await Promise.all([
        api.get(`/message-requests/incoming/${userId}`),
        api.get(`/message-requests/outgoing/${userId}`)
      ])

      setIncomingRequests(Array.isArray(incomingRes.data) ? incomingRes.data : [])
      setOutgoingRequests(Array.isArray(outgoingRes.data) ? outgoingRes.data : [])
    } catch (error) {
      console.error(error)
      setIncomingRequests([])
      setOutgoingRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    fetchRequests()

    const interval = setInterval(() => {
      fetchRequests(false)
    }, 3000)

    return () => clearInterval(interval)
  }, [userId])

  const acceptRequest = async (requestId) => {
    try {
      setActionLoadingId(requestId)
      await api.patch(`/message-requests/${requestId}/accept`)
      await fetchRequests(false)
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || "Failed to accept request")
    } finally {
      setActionLoadingId("")
    }
  }

  const rejectRequest = async (requestId) => {
    try {
      setActionLoadingId(requestId)
      await api.patch(`/message-requests/${requestId}/reject`)
      await fetchRequests(false)
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || "Failed to reject request")
    } finally {
      setActionLoadingId("")
    }
  }

  const cancelRequest = async (requestId) => {
    try {
      setActionLoadingId(requestId)
      await api.patch(`/message-requests/${requestId}/cancel`)
      await fetchRequests(false)
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || "Failed to cancel request")
    } finally {
      setActionLoadingId("")
    }
  }

  const getSenderLabel = (request) => {
    return request?.sender?.username || request?.sender?.email || "User"
  }

  const getReceiverLabel = (request) => {
    return request?.receiver?.username || request?.receiver?.email || "User"
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Message Requests</h1>

        {loading && <p>Loading...</p>}

        {!loading && (
          <>
            <section style={{ marginBottom: "30px" }}>
              <h2>Incoming Requests</h2>

              {incomingRequests.length === 0 && (
                <p>No incoming requests</p>
              )}

              {incomingRequests.map((req) => {
                const isLoading = actionLoadingId === req._id

                return (
                  <div
                    key={req._id}
                    style={{
                      border: "1px solid #ccc",
                      padding: "15px",
                      marginBottom: "15px",
                      borderRadius: "10px",
                      maxWidth: "500px"
                    }}
                  >
                    <p>
                      <strong>From:</strong> {getSenderLabel(req)}
                    </p>

                    <p>
                      <strong>Message:</strong> {req.message}
                    </p>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => acceptRequest(req._id)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Accept"}
                      </button>

                      <button
                        onClick={() => rejectRequest(req._id)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Reject"}
                      </button>
                    </div>
                  </div>
                )
              })}
            </section>

            <section>
              <h2>Outgoing Requests</h2>

              {outgoingRequests.length === 0 && (
                <p>No outgoing requests</p>
              )}

              {outgoingRequests.map((req) => {
                const isLoading = actionLoadingId === req._id

                return (
                  <div
                    key={req._id}
                    style={{
                      border: "1px solid #ccc",
                      padding: "15px",
                      marginBottom: "15px",
                      borderRadius: "10px",
                      maxWidth: "500px"
                    }}
                  >
                    <p>
                      <strong>To:</strong> {getReceiverLabel(req)}
                    </p>

                    <p>
                      <strong>Message:</strong> {req.message}
                    </p>

                    <p>
                      <strong>Status:</strong> Pending
                    </p>

                    <button
                      onClick={() => cancelRequest(req._id)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Cancel Request"}
                    </button>
                  </div>
                )
              })}
            </section>
          </>
        )}
      </div>
    </>
  )
}