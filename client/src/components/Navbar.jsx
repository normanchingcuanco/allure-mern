import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect, useState } from "react"
import api from "../api/axios"

export default function Navbar() {

  const { userId, logout } = useAuth()
  const navigate = useNavigate()

  const [unreadTotal, setUnreadTotal] = useState(0)

  useEffect(() => {

    if (!userId) return

    const fetchUnread = async () => {

      try {

        const res = await api.get(`/matches/${userId}`)

        const total = res.data.reduce(
          (sum, match) => sum + (match.unreadCount || 0),
          0
        )

        setUnreadTotal(total)

      } catch (err) {

        console.error("Unread fetch error:", err)

      }

    }

    fetchUnread()

    const interval = setInterval(fetchUnread, 5000)

    return () => clearInterval(interval)

  }, [userId])


  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>

      <button onClick={() => navigate("/discover")}>
        Discover
      </button>

      <button onClick={() => navigate("/likes")}>
        Likes
      </button>

      <button onClick={() => navigate("/matches")}>
        Matches {unreadTotal > 0 && `(${unreadTotal})`}
      </button>

      <button onClick={() => navigate("/favorites")}>
        Favorites
      </button>

      <button onClick={() => navigate("/message-requests")}>
        Message Requests
      </button>

      <button onClick={() => navigate("/edit-profile")}>
        Edit Profile
      </button>

      <button onClick={() => navigate("/blocked-users")}>
        Blocked Users
      </button>

      <button onClick={handleLogout}>
        Logout
      </button>

    </div>
  )
}