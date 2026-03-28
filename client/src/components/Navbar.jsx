import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const auth = useAuth()
  const navigate = useNavigate()

  const userId = auth?.userId || localStorage.getItem("userId")

  const [unreadMatchesCount, setUnreadMatchesCount] = useState(0)
  const [incomingRequestsCount, setIncomingRequestsCount] = useState(0)

  const fetchNavbarCounts = async () => {
    if (!userId) {
      setUnreadMatchesCount(0)
      setIncomingRequestsCount(0)
      return
    }

    try {
      const [matchesRes, requestsRes] = await Promise.all([
        api.get(`/matches/${userId}`),
        api.get(`/message-requests/incoming/${userId}`)
      ])

      const totalUnread = Array.isArray(matchesRes.data)
        ? matchesRes.data.reduce((sum, match) => {
            return sum + Number(match?.unreadCount || 0)
          }, 0)
        : 0

      const totalIncomingRequests = Array.isArray(requestsRes.data)
        ? requestsRes.data.length
        : 0

      setUnreadMatchesCount(totalUnread)
      setIncomingRequestsCount(totalIncomingRequests)
    } catch (error) {
      console.error("Navbar count fetch error:", error)
      setUnreadMatchesCount(0)
      setIncomingRequestsCount(0)
    }
  }

  useEffect(() => {
    if (!userId) {
      setUnreadMatchesCount(0)
      setIncomingRequestsCount(0)
      return
    }

    fetchNavbarCounts()

    const interval = setInterval(() => {
      fetchNavbarCounts()
    }, 3000)

    return () => clearInterval(interval)
  }, [userId])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("isAdmin")

    if (auth?.logout) {
      auth.logout()
    }

    navigate("/login")
  }

  return (
    <nav
      style={{
        display: "flex",
        gap: "15px",
        padding: "15px 20px",
        borderBottom: "1px solid #ddd",
        flexWrap: "wrap",
        alignItems: "center"
      }}
    >
      <Link to="/discover">Home</Link>
      <Link to="/discover">Discover</Link>
      <Link to="/favorites">Favorites</Link>
      <Link to="/matches">
        Matches {unreadMatchesCount > 0 ? `(${unreadMatchesCount})` : ""}
      </Link>
      <Link to="/message-requests">
        Message Requests {incomingRequestsCount > 0 ? `(${incomingRequestsCount})` : ""}
      </Link>
      <Link to={userId ? `/profile/${userId}` : "/login"}>My Profile</Link>

      <button onClick={handleLogout}>
        Logout
      </button>
    </nav>
  )
}