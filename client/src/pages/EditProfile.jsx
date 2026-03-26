import { useEffect, useState } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"

export default function EditProfile() {
  const { userId } = useAuth()

  const [profile, setProfile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profiles/user/${userId}`)
        setProfile(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchProfile()
  }, [userId])

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

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

      setProfile((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), res.data.imageUrl]
      }))
    } catch (err) {
      console.error(err)
      alert("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = (indexToRemove) => {
    setProfile((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await api.put(`/profiles/${profile._id}`, {
        ...profile,
        interests: Array.isArray(profile.interests)
          ? profile.interests
          : String(profile.interests || "")
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
      })

      alert("Profile updated")
    } catch (err) {
      console.error(err)
      alert("Profile update failed")
    }
  }

  if (!profile) return <p>Loading...</p>

  return (
    <>
      <Navbar />

      <h1>Edit Profile</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={profile.name || ""}
          onChange={handleChange}
          placeholder="Name"
        />

        <br /><br />

        <input
          name="age"
          value={profile.age || ""}
          onChange={handleChange}
          placeholder="Age"
        />

        <br /><br />

        <textarea
          name="bio"
          value={profile.bio || ""}
          onChange={handleChange}
          placeholder="Bio"
        />

        <br /><br />

        <input
          name="interests"
          value={
            Array.isArray(profile.interests)
              ? profile.interests.join(", ")
              : profile.interests || ""
          }
          onChange={(e) =>
            setProfile({
              ...profile,
              interests: e.target.value
            })
          }
          placeholder="Interests (comma separated)"
        />

        <br /><br />

        <input
          name="lifestyle"
          value={profile.lifestyle || ""}
          onChange={handleChange}
          placeholder="Lifestyle"
        />

        <br /><br />

        <input
          name="relationshipGoals"
          value={profile.relationshipGoals || ""}
          onChange={handleChange}
          placeholder="Relationship Goals"
        />

        <br /><br />

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
        />

        <br /><br />

        {uploading && <p>Uploading image...</p>}

        {profile.photos?.length > 0 && profile.photos.map((photo, index) => (
          <div key={index}>
            <img
              src={photo}
              alt="profile"
              width="150"
              onError={(e) => (e.target.style.display = "none")}
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
              style={{ marginTop: "6px", marginBottom: "10px" }}
            >
              Remove Photo
            </button>
          </div>
        ))}

        <br /><br />

        <button type="submit" disabled={uploading}>
          Save Changes
        </button>
      </form>
    </>
  )
}