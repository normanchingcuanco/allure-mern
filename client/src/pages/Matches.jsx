import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

export default function Matches() {

  const { userId } = useAuth()
  const [matches, setMatches] = useState([])
  const navigate = useNavigate()

  useEffect(() => {

    const fetchMatches = async () => {

      if (!userId) return

      try {

        const res = await api.get(`/matches/${userId}`)

        setMatches(res.data)

      } catch (err) {
        console.error(err)
      }

    }

    fetchMatches()

  }, [userId])

  return (
    <div>

      <h1>Your Matches</h1>

      {matches.length === 0 && <p>No matches yet</p>}

      {matches.map((match) => (

        <div
          key={match.matchId}
          style={{border:"1px solid #ccc", margin:"10px", padding:"10px", cursor:"pointer"}}
          onClick={() => navigate(`/chat/${match.matchId}`)}
        >

          <p>{match.user?.email}</p>

        </div>

      ))}

    </div>
  )
}