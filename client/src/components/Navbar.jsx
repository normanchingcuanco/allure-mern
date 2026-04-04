import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../api/axios"

export default function Navbar() {
  const navigate = useNavigate()

  const [isVerified, setIsVerified] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [requestCount, setRequestCount] = useState(0)
  const [incomingLikesCount, setIncomingLikesCount] = useState(0)
  const [newMatchesCount, setNewMatchesCount] = useState(0)

  const userId = localStorage.getItem("userId")
  const isAdmin = localStorage.getItem("isAdmin") === "true"

  useEffect(() => {
    if (!userId) return

    const fetchNavbarData = async () => {
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
        setUnreadCount(unreadRes.data.count || 0)
        setRequestCount(requestRes.data.count || 0)
        setIncomingLikesCount(incomingLikesRes.data.count || 0)
        setNewMatchesCount(newMatchesRes.data.count || 0)
      } catch (err) {
        console.error(err)
      }
    }

    fetchNavbarData()

    const interval = setInterval(() => {
      fetchNavbarData()
    }, 5000)

    return () => clearInterval(interval)
  }, [userId])

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