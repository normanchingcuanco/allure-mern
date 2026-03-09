import { useEffect, useState } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"

export default function Discover() {

  const { userId } = useAuth()

  const [profiles, setProfiles] = useState([])
  const [mode, setMode] = useState("")

  const navigate = useNavigate()

  useEffect(() => {

    const fetchProfiles = async () => {

      if (!userId) return

      try {

        const res = await api.get(`/profiles/discover/${userId}`)

        setMode(res.data.mode)

        if (res.data.mode === "browse") {
          setProfiles(res.data.profiles || [])
        }

      } catch (err) {
        console.error(err)
      }

    }

    fetchProfiles()

  }, [userId])

  const handleLike = async (receiverId) => {

    try {

      await api.post("/likes", {
        senderId: userId,
        receiverId
      })

      alert("Like sent")

    } catch (err) {
      console.error(err)
    }

  }

  return (
    <>
      <Navbar />

      <div>

        <h1>Discover</h1>

        <p>Mode: {mode}</p>

        {profiles.length === 0 && <p>No profiles available</p>}

        {profiles.map((profile) => (

          <div
            key={profile._id}
            onClick={() => navigate(`/profile/${profile.userId._id}`)}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
              cursor: "pointer"
            }}
          >

            <h3>{profile.name}</h3>
            <p>Age: {profile.age}</p>
            <p>{profile.bio}</p>

            <button
              onClick={(e) => {
                e.stopPropagation()
                handleLike(profile.userId._id)
              }}
            >
              Like
            </button>

          </div>

        ))}

      </div>
    </>
  )
}