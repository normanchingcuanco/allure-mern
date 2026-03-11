import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={() => navigate("/discover")}>
        Discover
      </button>

      <button onClick={() => navigate("/likes")}>
        Likes
      </button>

      <button onClick={() => navigate("/matches")}>
        Matches
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

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}