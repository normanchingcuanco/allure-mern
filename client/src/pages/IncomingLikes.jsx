import { useEffect, useState } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"

export default function IncomingLikes() {

  const { userId } = useAuth()
  const [likes, setLikes] = useState([])

  useEffect(() => {

    const fetchLikes = async () => {

      try {
        const res = await api.get(`/likes/incoming/${userId}`)
        setLikes(res.data)
      } catch (err) {
        console.error(err)
      }

    }

    if (userId) fetchLikes()

  }, [userId])

  const likeBack = async (senderId) => {

    try {

      await api.post("/likes", {
        senderId: userId,
        receiverId: senderId
      })

      alert("Match created")

      setLikes(prev =>
        prev.filter(like => like.sender._id !== senderId)
      )

    } catch (err) {
      console.error(err)
    }

  }

  return (
    <>
      <Navbar />

      <div>

        <h1>INCOMING LIKES PAGE TEST</h1>

        {likes.length === 0 && <p>No likes yet</p>}

        {likes.map((like) => (

          <div
            key={like._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px"
            }}
          >

            <p>User Email:</p>
            <p>{like.senderId?.email}</p>

            <button
              onClick={() => likeBack(like.senderId._id)}
            >
              Like Back
            </button>

          </div>

        ))}

      </div>
    </>
  )

}