import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"

export default function Profile() {

  const { userId } = useParams()
  const [profile, setProfile] = useState(null)

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const res = await api.get(`/profiles/${userId}`)
        setProfile(res.data)

      } catch (err) {
        console.error(err)
      }

    }

    fetchProfile()

  }, [userId])

  if (!profile) {
    return <p>Loading...</p>
  }

  return (
    <>
      <Navbar />

      <h1>{profile.name}</h1>

      <p>Age: {profile.age}</p>

      <p>{profile.bio}</p>

      <h3>Interests</h3>
      <ul>
        {profile.interests.map((interest, index) => (
          <li key={index}>{interest}</li>
        ))}
      </ul>

      <p>Lifestyle: {profile.lifestyle}</p>

      <p>Relationship Goals: {profile.relationshipGoals}</p>

      <h3>Photos</h3>

      {profile.photos.map((photo, index) => (
        <img key={index} src={photo} width="200" alt="profile"/>
      ))}

    </>
  )
}