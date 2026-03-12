import { useEffect, useState } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"

export default function Discover() {

  const { userId } = useAuth()

  const [profiles, setProfiles] = useState([])
  const [mode, setMode] = useState("")
  const [loading, setLoading] = useState(true)

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

        console.error("Discover fetch error:", err)

      } finally {
        setLoading(false)
      }

    }

    fetchProfiles()

  }, [userId])


  const handleLike = async (receiverId) => {

    try {

      const res = await api.post("/likes", {
        senderId: userId,
        receiverId
      })

      if (res.data?.isMatch) {

        setMatchedUser(receiverId)
        setMatchId(res.data.matchId)
        setShowMatchModal(true)

      } else {

        alert("Like sent")

      }

    } catch (err) {

      console.error("Like error:", err)

    }

  }


  const handleFavorite = async (profileId) => {

    try {

      await api.post("/favorites", {
        userId,
        profileId
      })

      alert("Profile added to favorites")

    } catch (err) {
      console.error("Favorite error:", err)
    }

  }


  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <h2>Loading profiles...</h2>
        </div>
      </>
    )
  }


  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>

        <h1>Discover</h1>

        <p>Mode: {mode}</p>

        {profiles.length === 0 && (
          <p>No profiles available</p>
        )}

        {profiles.map(profile => {

          if (!profile?.userId) return null

          return (
            <div
              key={profile._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "20px",
                maxWidth: "400px"
              }}
            >

              {profile.photos && profile.photos.length > 0 && (
                <img
                  src={profile.photos[0]}
                  alt={profile.name}
                  style={{
                    width: "100%",
                    borderRadius: "10px"
                  }}
                />
              )}

              <h3>{profile.name}</h3>
              <p>Age: {profile.age}</p>
              <p>{profile.bio}</p>

              <div style={{ display: "flex", gap: "10px" }}>

                <button
                  onClick={() => handleLike(profile.userId._id)}
                >
                  Like
                </button>

                <button
                  onClick={() => handleFavorite(profile._id)}
                >
                  Favorite
                </button>

              </div>

            </div>
          )

        })}

      </div>
    </>
  )
}