import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"

const formatMessageTime = (value) => {
  if (!value) return ""

  const date = new Date(value)

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  })
}

export default function Matches() {
  const [matches, setMatches] = useState([])
  const userId = localStorage.getItem("userId")
  const navigate = useNavigate()

  const fetchMatches = async () => {
    if (!userId) return

    try {
      const res = await api.get(`/matches/${userId}`)
      setMatches(res.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const unmatch = async (matchId) => {
    try {
      await api.delete(`/matches/${matchId}`, {
        data: { userId }
      })

      setMatches(prev =>
        prev.filter(match => match.matchId !== matchId)
      )
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [userId])

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Your Matches</h1>

        {matches.length === 0 && (
          <p>No matches yet</p>
        )}

        {matches.map((match) => (
          <div
            key={match.matchId}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flex: 1,
                minWidth: 0
              }}
            >
              {match.photo ? (
                <img
                  src={match.photo}
                  alt={match.name}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold"
                  }}
                >
                  {match.name?.charAt(0) || "U"}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 6px 0" }}>
                  <strong>{match.name || "User"}</strong>
                </p>

                <p
                  style={{
                    margin: "0 0 6px 0",
                    color: "#555",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {match.lastMessage || "No messages yet"}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap"
                  }}
                >
                  {match.lastMessageTime && (
                    <small style={{ color: "#777" }}>
                      {formatMessageTime(match.lastMessageTime)}
                    </small>
                  )}

                  {match.unreadCount > 0 && (
                    <span
                      style={{
                        background: "#222",
                        color: "#fff",
                        borderRadius: "999px",
                        padding: "3px 8px",
                        fontSize: "12px"
                      }}
                    >
                      {match.unreadCount} unread
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
              <button onClick={() => navigate(`/chat/${match.matchId}`)}>
                Open Chat
              </button>

              <button onClick={() => unmatch(match.matchId)}>
                Unmatch
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}