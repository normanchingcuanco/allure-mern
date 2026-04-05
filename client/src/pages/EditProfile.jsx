// client/src/pages/EditProfile.jsx
import { useEffect, useState } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"

const MAX_PHOTOS = 6

export default function EditProfile() {
  const { userId } = useAuth()

  const [profile, setProfile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

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

    if ((profile.photos?.length || 0) >= MAX_PHOTOS) {
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

      setProfile(prev => ({
        ...prev,
        photos: [...(prev.photos || []), res.data.imageUrl]
      }))
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Image upload failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const removePhoto = (indexToRemove) => {
    setProfile(prev => ({
      ...prev,
      photos: (prev.photos || []).filter((_, index) => index !== indexToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!profile.name?.trim()) {
      alert("Name is required")
      return
    }

    if (!profile.age || Number(profile.age) < 18) {
      alert("Age must be 18 or above")
      return
    }

    try {
      setSaving(true)

      await api.put(`/profiles/${profile._id}`, {
        name: profile.name?.trim(),
        age: Number(profile.age),
        bio: profile.bio?.trim() || "",
        interests: Array.isArray(profile.interests)
          ? profile.interests
          : String(profile.interests || "")
              .split(",")
              .map(item => item.trim())
              .filter(Boolean),
        lifestyle: profile.lifestyle?.trim() || "",
        relationshipGoals: profile.relationshipGoals?.trim() || "",
        photos: profile.photos || []
      })

      alert("Profile updated")
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Profile update failed")
    } finally {
      setSaving(false)
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
          type="number"
          min="18"
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
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handlePhotoUpload}
          disabled={uploading || (profile.photos?.length || 0) >= MAX_PHOTOS}
        />

        <br /><br />

        <p>
          Photos: {profile.photos?.length || 0}/{MAX_PHOTOS}
        </p>

        {uploading && <p>Uploading image...</p>}

        {profile.photos?.length > 0 && profile.photos.map((photo, index) => (
          <div key={index} style={{ marginBottom: "12px" }}>
            <img
              src={photo}
              alt={`profile-${index + 1}`}
              width="150"
              onError={(e) => {
                e.target.style.display = "none"
              }}
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
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </>
  )
}