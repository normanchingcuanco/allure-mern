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
        />

        <br /><br />

        <input
          name="age"
          value={profile.age}
          onChange={handleChange}
        />

        <br /><br />

        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="lifestyle"
          value={profile.lifestyle}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="relationshipGoals"
          value={profile.relationshipGoals}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Save Changes
        </button>

      </form>

    </>
  )
}