import { useEffect, useState } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

export default function Likes() {

  const { userId } = useAuth()
  const [likes, setLikes] = useState([])

  useEffect(() => {

    const fetchLikes = async () => {

      if (!userId) return

      try {

        const res = await api.get(`/profiles/discover/${userId}`)

        setLikes(Array.isArray(res.data.likes) ? res.data.likes : [])

      } catch (err) {
        console.error(err)
      }

    }

    fetchLikes()

  }, [userId])

  return (
    <div>

      <h1>Incoming Likes</h1>

      {likes.length === 0 && <p>No incoming likes</p>}

      {likes.map((like) => (

        <div key={like._id} style={{border:"1px solid #ccc", margin:"10px", padding:"10px"}}>

          <p>User Email:</p>
          <p>{like.senderId?.email}</p>

        </div>

      ))}

    </div>
  )
}