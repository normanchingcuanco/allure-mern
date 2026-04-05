// client/src/pages/CreateProfile.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"

const MAX_PHOTOS = 6

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
  const [saving, setSaving] = useState(false)

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]

    if (!file) return

    if (photos.length >= MAX_PHOTOS) {
      alert(`You can upload up to ${MAX_PHOTOS} photos only`)
      e.target.value = ""
      return
    }

    const formData = new FormData()
    formData.append("image", file)

    try {
      setUploading(true)

      const res = await api.post("/profiles/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      setPhotos(prev => [...prev, res.data.imageUrl])
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Image upload failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const removePhoto = (indexToRemove) => {
    setPhotos(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      alert("Name is required")
      return
    }

    if (!age || Number(age) < 18) {
      alert("Age must be 18 or above")
      return
    }

    try {
      setSaving(true)

      await api.post("/profiles", {
        userId,
        name: name.trim(),
        age: Number(age),
        bio: bio.trim(),
        interests: interests
          .split(",")
          .map(item => item.trim())
          .filter(Boolean),
        lifestyle: lifestyle.trim(),
        relationshipGoals: relationshipGoals.trim(),
        photos
      })

      navigate("/discover")
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Failed to create profile")
    } finally {
      setSaving(false)
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
          type="number"
          min="18"
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
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handlePhotoUpload}
          disabled={uploading || photos.length >= MAX_PHOTOS}
        />

        <br /><br />

        <p>
          Photos: {photos.length}/{MAX_PHOTOS}
        </p>

        {uploading && <p>Uploading image...</p>}

        {photos.length > 0 && photos.map((photo, index) => (
          <div key={index} style={{ marginBottom: "12px" }}>
            <img
              src={photo}
              alt={`profile-${index + 1}`}
              width="150"
              style={{
                marginTop: "10px",
                marginRight: "10px",
                borderRadius: "8px",
                display: "block"
              }}
            />

            <button
              type="button"
              onClick={() => removePhoto(index)}
              style={{ marginTop: "6px" }}
            >
              Remove Photo
            </button>
          </div>
        ))}

        <br /><br />

        <button type="submit" disabled={uploading || saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </>
  )
}