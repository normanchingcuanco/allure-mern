import { Link, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import api from "../api/axios"
import socket from "../socket"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [isVerified, setIsVerified] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [requestCount, setRequestCount] = useState(0)
  const [incomingLikesCount, setIncomingLikesCount] = useState(0)
  const [newMatchesCount, setNewMatchesCount] = useState(0)

  const userId = localStorage.getItem("userId")
  const isAdmin = localStorage.getItem("isAdmin") === "true"

  const fetchNavbarData = useCallback(async () => {
    if (!userId) return

    try {
      const [
        profileRes,
        unreadRes,
        requestRes,
        incomingLikesRes,
        newMatchesRes
      ] = await Promise.all([
        api.get(`/profiles/user/${userId}`),
        api.get(`/messages/unread-count/${userId}`),
        api.get(`/message-requests/count/${userId}`),
        api.get(`/likes/incoming/count/${userId}`),
        api.get(`/matches/new-count/${userId}`)
      ])

      setIsVerified(profileRes.data.isVerified || false)
      setUnreadCount(Number(unreadRes.data.count || 0))
      setRequestCount(Number(requestRes.data.count || 0))
      setIncomingLikesCount(Number(incomingLikesRes.data.count || 0))
      setNewMatchesCount(Number(newMatchesRes.data.count || 0))
    } catch (err) {
      console.error(err)
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return

    fetchNavbarData()
    socket.emit("register_user", userId)

    const handleRefresh = () => {
      fetchNavbarData()
    }

    const handleNewMessage = (payload) => {
      if (!payload) return

      const receiverId =
        payload.receiverId?.toString?.() || payload.receiverId || ""

      if (receiverId !== userId) return

      const isChatPage = location.pathname.startsWith("/chat/")

      if (!isChatPage) {
        setUnreadCount((prev) => prev + 1)
      }

      fetchNavbarData()
    }

    socket.on("notifications_refresh", handleRefresh)
    socket.on("new_message", handleNewMessage)

    return () => {
      socket.off("notifications_refresh", handleRefresh)
      socket.off("new_message", handleNewMessage)
    }
  }, [userId, fetchNavbarData, location.pathname])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("isAdmin")
    navigate("/")
  }

  const badgeStyle = {
    background: "red",
    color: "white",
    borderRadius: "999px",
    padding: "2px 6px",
    fontSize: "12px",
    marginLeft: "6px",
    display: "inline-block",
    minWidth: "18px",
    textAlign: "center"
  }

  const linkStyle = {
    textDecoration: "none"
  }

  return (
    <nav
      style={{
        marginBottom: "20px",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        alignItems: "center"
      }}
    >
      <Link to="/discover" style={linkStyle}>Discover</Link>

      <Link to="/likes" style={linkStyle}>Favorites</Link>

      <Link to="/incoming-likes" style={linkStyle}>
        Incoming Likes
        {incomingLikesCount > 0 && (
          <span style={badgeStyle}>{incomingLikesCount}</span>
        )}
      </Link>

      <Link to="/matches" style={linkStyle}>
        Matches
        {(unreadCount > 0 || newMatchesCount > 0) && (
          <span style={badgeStyle}>{unreadCount + newMatchesCount}</span>
        )}
      </Link>

      <Link to="/message-requests" style={linkStyle}>
        Message Requests
        {requestCount > 0 && (
          <span style={badgeStyle}>{requestCount}</span>
        )}
      </Link>

      <Link to="/blocked-users" style={linkStyle}>Blocked Users</Link>

      <Link to="/verification-request" style={linkStyle}>
        Verification {isVerified && "✅"}
      </Link>

      {isAdmin && (
        <>
          <Link to="/admin/verification" style={linkStyle}>Admin Verification</Link>
          <Link to="/admin/reports" style={linkStyle}>Admin Reports</Link>
        </>
      )}

      <Link to={`/profile/${userId}`} style={linkStyle}>My Profile</Link>
      <Link to="/settings" style={linkStyle}>Settings</Link>

      <button onClick={handleLogout}>
        Logout
      </button>
    </nav>
  )
}