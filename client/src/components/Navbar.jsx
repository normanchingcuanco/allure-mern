import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {

  const navigate = useNavigate()

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
      <Link to="/profile">My Profile</Link> {" | "}

      <button onClick={handleLogout}>
        Logout
      </button>

    </nav>
  )
}