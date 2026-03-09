import { useEffect, useState } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"

export default function Matches() {

  const { userId } = useAuth()
  const navigate = useNavigate()

  const [matches, setMatches] = useState([])

  useEffect(() => {

    const fetchMatches = async () => {

      try {

        const res = await api.get(`/matches/${userId}`)
        setMatches(res.data || [])

      } catch (err) {
        console.error(err)
      }

    }

    fetchMatches()

  }, [userId])

  return (
    <>
      <Navbar />

      <h1>Matches</h1>

      {matches.length === 0 && <p>No matches yet</p>}

      {matches.map((match) => (

        <div
          key={match.matchId}
          onClick={() => navigate(`/chat/${match.matchId}`)}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            margin: "10px",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}
        >

          {match.user.profile?.photos?.[0] && (
            <img
              src={match.user.profile.photos[0]}
              alt="profile"
              width="60"
              height="60"
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          )}

          <div>

            <h3>{match.user.profile?.name || match.user.email}</h3>

            {match.lastMessage && (
              <p>{match.lastMessage}</p>
            )}

          </div>

        </div>

      ))}

    </>
  )
}