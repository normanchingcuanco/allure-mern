import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"

export default function IncomingLikes() {
  const navigate = useNavigate()
  const userId = localStorage.getItem("userId")

  const [likes, setLikes] = useState([])

  useEffect(() => {
    const fetchIncomingLikes = async () => {
      try {
        const res = await api.get(`/likes/incoming/${userId}`)
        setLikes(res.data || [])
      } catch (error) {
        console.error(error)
      }
    }

    if (userId) {
      fetchIncomingLikes()
    }
  }, [userId])

  const likeBack = async (senderId) => {
    try {
      const res = await api.post("/likes", {
        senderId: userId,
        receiverId: senderId
      })

      setLikes((prev) => prev.filter((like) => like.senderId?._id !== senderId))

      if (res.data?.match) {
        alert("It's a match!")
        navigate("/matches")
        return
      }

      alert(res.data?.message || "Like sent")
    } catch (error) {
      console.error(error)

      const message = error.response?.data?.message || "Failed to like back"

      if (message === "Already liked this user" || message === "Already matched") {
        setLikes((prev) => prev.filter((like) => like.senderId?._id !== senderId))
        alert("You already matched with this user. Redirecting to Matches.")
        navigate("/matches")
        return
      }

      alert(message)
    }
  }

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h2>Incoming Likes</h2>

        {likes.length === 0 ? (
          <p>No incoming likes yet</p>
        ) : (
          likes.map((like) => (
            <div
              key={like._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px"
              }}
            >
              <p><strong>Email:</strong> {like.senderId?.email || "Unknown"}</p>

              <button onClick={() => likeBack(like.senderId?._id)}>
                Like Back
              </button>
            </div>
          ))
        )}
      </div>
    </>
  )
}