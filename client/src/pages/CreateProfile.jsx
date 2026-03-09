import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"

export default function CreateProfile() {

  const { userId } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [bio, setBio] = useState("")
  const [interests, setInterests] = useState("")
  const [lifestyle, setLifestyle] = useState("")
  const [relationshipGoals, setRelationshipGoals] = useState("")
  const [photos, setPhotos] = useState("")

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      await api.post("/profiles", {
        userId,
        name,
        age,
        bio,
        interests: interests.split(","),
        lifestyle,
        relationshipGoals,
        photos: photos.split(",")
      })

      navigate("/discover")

    } catch (err) {
      console.error(err)
    }

  }

  return (
    <>
      <Navbar />

      <h1>Create Profile</h1>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <br /><br />

        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Interests (comma separated)"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Lifestyle"
          value={lifestyle}
          onChange={(e) => setLifestyle(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Relationship Goals"
          value={relationshipGoals}
          onChange={(e) => setRelationshipGoals(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Photo URLs (comma separated)"
          value={photos}
          onChange={(e) => setPhotos(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Save Profile
        </button>

      </form>
    </>
  )
}