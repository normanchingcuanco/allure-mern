import { useEffect, useState } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"

export default function EditProfile() {

  const { userId } = useAuth()

  const [profile, setProfile] = useState(null)

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

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      await api.put(`/profiles/${profile._id}`, profile)

      alert("Profile updated")

    } catch (err) {
      console.error(err)
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
          value={profile.name}
          onChange={handleChange}
          placeholder="Name"
        />

        <br /><br />

        <input
          name="age"
          value={profile.age}
          onChange={handleChange}
          placeholder="Age"
        />

        <br /><br />

        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          placeholder="Bio"
        />

        <br /><br />

        <input
          name="lifestyle"
          value={profile.lifestyle}
          onChange={handleChange}
          placeholder="Lifestyle"
        />

        <br /><br />

        <input
          name="relationshipGoals"
          value={profile.relationshipGoals}
          onChange={handleChange}
          placeholder="Relationship Goals"
        />

        <br /><br />

        <input
          name="photos"
          value={profile.photos?.join(",")}
          onChange={(e) =>
            setProfile({
              ...profile,
              photos: e.target.value.split(",")
            })
          }
          placeholder="Photo URLs (comma separated)"
        />

        {profile.photos && profile.photos.map((photo, index) => (
          <div key={index}>
            <img
              src={photo}
              alt="profile"
              width="150"
              onError={(e) => (e.target.style.display = "none")}
              style={{
                marginTop: "10px",
                marginRight: "10px",
                borderRadius: "8px"
              }}
            />
          </div>
        ))}

        <br /><br />

        <button type="submit">
          Save Changes
        </button>

      </form>

    </>
  )
}