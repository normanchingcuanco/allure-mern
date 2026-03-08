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
    <div style={{marginBottom:"20px"}}>

      <button onClick={() => navigate("/discover")}>
        Discover
      </button>

      <button onClick={() => navigate("/likes")}>
        Likes
      </button>

      <button onClick={() => navigate("/matches")}>
        Matches
      </button>

      <button onClick={handleLogout}>
        Logout
      </button>

    </div>
  )
}