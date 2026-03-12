import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"

export default function Matches() {

  const [matches, setMatches] = useState([])
  const userId = localStorage.getItem("userId")
  const navigate = useNavigate()

  const fetchMatches = async () => {

    if (!userId) return

    try {

      const res = await api.get(`/matches/${userId}`)
      setMatches(res.data || [])

    } catch (error) {
      console.error(error)
    }

  }

  const unmatch = async (matchId) => {

    try {

      await api.delete(`/matches/${matchId}`)

      setMatches(prev =>
        prev.filter(match => match.matchId !== matchId)
      )

    } catch (error) {
      console.error(error)
    }

  }

  useEffect(() => {
    fetchMatches()
  }, [userId])


  return (
    <>
      <Navbar />

      <h1>Your Matches</h1>

      {matches.length === 0 && (
        <p>No matches yet</p>
      )}

      {matches.map((match) => (

        <div
          key={match.matchId}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px"
          }}
        >

          <p>
            <strong>{match.user?.email || "User"}</strong>
          </p>

          {match.lastMessage && (
            <p>
              Last message: {match.lastMessage}
            </p>
          )}

          <button
            onClick={() => navigate(`/chat/${match.matchId}`)}
            style={{ marginRight: "10px" }}
          >
            Open Chat
          </button>

          <button
            onClick={() => unmatch(match.matchId)}
          >
            Unmatch
          </button>

        </div>

      ))}

    </>
  )
}