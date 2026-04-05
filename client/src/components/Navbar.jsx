import { useEffect, useState, useCallback } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import socket from "../socket"

export default function Navbar() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const userId = auth?.userId || localStorage.getItem("userId")
  const isAdmin = (auth?.isAdmin || localStorage.getItem("isAdmin")) === "true"

  console.log("Navbar render active:", userId)

  const [incomingLikesCount, setIncomingLikesCount] = useState(0)
  const [newMatchesCount, setNewMatchesCount] = useState(0)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
  const [hasProfile, setHasProfile] = useState(true)

  const fetchCounts = useCallback(async () => {
    if (!userId) {
      setIncomingLikesCount(0)
      setNewMatchesCount(0)
      setUnreadMessagesCount(0)
      return
    }

    try {
      const [likesRes, matchesRes, unreadRes] = await Promise.all([
        api.get(`/likes/incoming/count/${userId}`),
        api.get(`/matches/new-count/${userId}`),
        api.get(`/messages/unread-count/${userId}`)
      ])

      setIncomingLikesCount(Number(likesRes.data?.count || 0))
      setNewMatchesCount(Number(matchesRes.data?.count || 0))
      setUnreadMessagesCount(Number(unreadRes.data?.count || 0))
    } catch (error) {
      console.error("Navbar count fetch error:", error)
    }
  }, [userId])

  const checkProfileStatus = useCallback(async () => {
    if (!userId) {
      setHasProfile(false)
      return
    }

    try {
      await api.get(`/profiles/user/${userId}`)
      setHasProfile(true)
    } catch (error) {
      if (error.response?.status === 404) {
        setHasProfile(false)
      } else {
        console.error("Navbar profile check error:", error)
      }
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return

    fetchCounts()
    checkProfileStatus()

    console.log("Navbar registering user:", userId)
    socket.emit("register_user", userId)

    const handleRefresh = () => {
      console.log("Navbar notifications_refresh received")
      fetchCounts()
      checkProfileStatus()
    }

    socket.on("notifications_refresh", handleRefresh)

    return () => {
      socket.off("notifications_refresh", handleRefresh)
    }
  }, [userId, fetchCounts, checkProfileStatus])

  const handleLogout = () => {
    auth?.logout?.()
    navigate("/login")
  }

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: location.pathname === path ? "#fff" : "#333",
    background: location.pathname === path ? "#333" : "#f3f3f3",
    padding: "8px 12px",
    borderRadius: "8px",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px"
  })

  const badgeStyle = {
    background: "#ff4d4f",
    color: "#fff",
    borderRadius: "999px",
    minWidth: "20px",
    height: "20px",
    padding: "0 6px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "700"
  }

  return (
    <nav
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid #ddd",
        marginBottom: "20px"
      }}
    >
      <Link to="/discover" style={linkStyle("/discover")}>
        Home
      </Link>

      <Link to="/matches" style={linkStyle("/matches")}>
        Matches
        {newMatchesCount > 0 && (
          <span style={badgeStyle}>{newMatchesCount}</span>
        )}
        {unreadMessagesCount > 0 && (
          <span style={badgeStyle}>{unreadMessagesCount}</span>
        )}
      </Link>

      <Link to="/incoming-likes" style={linkStyle("/incoming-likes")}>
        Incoming Likes
        {incomingLikesCount > 0 && (
          <span style={badgeStyle}>{incomingLikesCount}</span>
        )}
      </Link>

      <Link to="/message-requests" style={linkStyle("/message-requests")}>
        Message Requests
      </Link>

      <Link to="/favorites" style={linkStyle("/favorites")}>
        Favorites
      </Link>

      {!hasProfile && (
        <Link to="/create-profile" style={linkStyle("/create-profile")}>
          Create Profile
        </Link>
      )}

      {hasProfile && (
        <>
          <Link to={`/profile/${userId}`} style={linkStyle(`/profile/${userId}`)}>
            My Profile
          </Link>

          <Link to="/edit-profile" style={linkStyle("/edit-profile")}>
            Edit Profile
          </Link>

          <Link to="/blocked-users" style={linkStyle("/blocked-users")}>
            Blocked Users
          </Link>
        </>
      )}

      {isAdmin && (
        <>
          <Link to="/admin/verification" style={linkStyle("/admin/verification")}>
            Admin Verification
          </Link>

          <Link to="/admin/reports" style={linkStyle("/admin/reports")}>
            Admin Reports
          </Link>
        </>
      )}

      <button
        onClick={handleLogout}
        style={{
          marginLeft: "auto",
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </nav>
  )
}