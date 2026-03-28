import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext"

export default function Matches() {
  const auth = useAuth()
  const userId = auth?.userId || localStorage.getItem("userId")

  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [unmatchingId, setUnmatchingId] = useState("")

  const fetchMatches = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      const res = await api.get(`/matches/${userId}`)

      const normalizedMatches = Array.isArray(res.data)
        ? res.data.map((match) => ({
            ...match,
            unreadCount: Number(match?.unreadCount || 0),
            otherUser: match?.otherUser || null,
            lastMessage: match?.lastMessage || null
          }))
        : []

      setMatches(normalizedMatches)
    } catch (error) {
      console.error(error)
      setMatches([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userId) return

    fetchMatches()

    const interval = setInterval(() => {
      fetchMatches()
    }, 3000)

    return () => clearInterval(interval)
  }, [userId])

  const handleUnmatch = async (matchId) => {
    const confirmed = window.confirm("Are you sure you want to unmatch?")
    if (!confirmed) return

    try {
      setUnmatchingId(matchId)

      await api.delete(`/matches/${matchId}`, {
        data: { userId }
      })

      setMatches((prev) => prev.filter((match) => match._id !== matchId))
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || "Failed to unmatch")
    } finally {
      setUnmatchingId("")
    }
  }

  const formatTime = (value) => {
    if (!value) return ""

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return ""

    return date.toLocaleString()
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Matches</h1>

        {loading && <p>Loading matches...</p>}

        {!loading && matches.length === 0 && (
          <p>No matches yet</p>
        )}

        {!loading &&
          matches.map((match) => {
            const otherUserEmail = match?.otherUser?.email || "User"
            const unreadCount = Number(match?.unreadCount || 0)
            const lastMessageText = match?.lastMessage?.text || "No messages yet"
            const lastMessageTime = match?.lastMessage?.createdAt
              ? formatTime(match.lastMessage.createdAt)
              : ""

            return (
              <div
                key={match._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "15px",
                  marginBottom: "15px",
                  maxWidth: "500px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px"
                  }}
                >
                  <h3 style={{ marginTop: 0, marginBottom: "8px" }}>
                    {otherUserEmail}
                  </h3>

                  {unreadCount > 0 && (
                    <span
                      style={{
                        background: "#ff4d4f",
                        color: "#fff",
                        borderRadius: "999px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        minWidth: "28px",
                        textAlign: "center"
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </div>

                <p style={{ marginBottom: "8px" }}>
                  <strong>Last message:</strong> {lastMessageText}
                </p>

                {lastMessageTime && (
                  <p style={{ marginTop: 0, color: "#666", fontSize: "14px" }}>
                    {lastMessageTime}
                  </p>
                )}

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <Link to={`/chat/${match._id}`}>
                    <button>Open Chat</button>
                  </Link>

                  <button
                    onClick={() => handleUnmatch(match._id)}
                    disabled={unmatchingId === match._id}
                  >
                    {unmatchingId === match._id ? "Unmatching..." : "Unmatch"}
                  </button>
                </div>
              </div>
            )
          })}
      </div>
    </>
  )
}