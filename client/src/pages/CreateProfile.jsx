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
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]

    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    try {
      setUploading(true)

      const res = await api.post("/profiles/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      setPhotos((prev) => [...prev, res.data.imageUrl])
    } catch (err) {
      console.error(err)
      alert("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await api.post("/profiles", {
        userId,
        name,
        age,
        bio,
        interests: interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        lifestyle,
        relationshipGoals,
        photos
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
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
        />

        <br /><br />

        {uploading && <p>Uploading image...</p>}

        {photos.length > 0 && photos.map((photo, index) => (
          <div key={index}>
            <img
              src={photo}
              alt="profile"
              width="150"
              style={{
                marginTop: "10px",
                marginRight: "10px",
                borderRadius: "8px"
              }}
            />
          </div>
        ))}

        <br /><br />

        <button type="submit" disabled={uploading}>
          Save Profile
        </button>
      </form>
    </>
  )
}