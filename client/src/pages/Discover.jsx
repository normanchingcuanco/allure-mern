import { useEffect, useState } from "react"
import api from "../api/axios"

export default function Discover() {

  const [profiles, setProfiles] = useState([])
  const [mode, setMode] = useState("")

  const userId = "69ad6ba34627d46e69c2805b" // Michael

  useEffect(() => {
    const fetchProfiles = async () => {
      const res = await api.get(`/profiles/discover/${userId}`)

      setMode(res.data.mode)

      if (res.data.mode === "browse") {
        setProfiles(res.data.profiles)
      }
    }

    fetchProfiles()
  }, [])

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
    <div>

      <h1>Discover</h1>

      <p>Mode: {mode}</p>

      {profiles.map((profile) => (
        <div key={profile._id} style={{border:"1px solid #ccc", margin:"10px", padding:"10px"}}>

          <h3>{profile.name}</h3>
          <p>Age: {profile.age}</p>
          <p>{profile.bio}</p>

          <button onClick={() => handleLike(profile.userId._id)}>
            Like
          </button>

        </div>
      ))}

    </div>
  )
}