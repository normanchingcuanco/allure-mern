import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../api/axios"

export default function Navbar() {

  const navigate = useNavigate()

  const [isVerified, setIsVerified] = useState(false)

  const userId = localStorage.getItem("userId")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profiles/user/${userId}`)
        setIsVerified(res.data.isVerified)
      } catch (err) {
        console.error(err)
      }
    }

    if (userId) fetchProfile()
  }, [userId])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    navigate("/")
  }

  return (
    <nav style={{ marginBottom: "20px" }}>

      <Link to="/discover">Discover</Link> {" | "}
      <Link to="/likes">Favorites</Link> {" | "}
      <Link to="/matches">Matches</Link> {" | "}
      <Link to="/message-requests">Message Requests</Link> {" | "}
      <Link to="/blocked-users">Blocked Users</Link> {" | "}
      <Link to="/verification-request">
        Verification {isVerified && "✅"}
      </Link> {" | "}
      <Link to={`/profile/${userId}`}>My Profile</Link> {" | "}

      <button onClick={handleLogout}>
        Logout
      </button>

    </nav>
  )
}