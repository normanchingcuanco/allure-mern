import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"

export default function Profile() {

  const { userId } = useParams()

  const [profile, setProfile] = useState(null)
  const [reportReason, setReportReason] = useState("")
  const [reportDescription, setReportDescription] = useState("")

  const currentUserId = localStorage.getItem("userId")

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

  const handleReport = async () => {

    if (!reportReason) {
      alert("Please select a reason")
      return
    }

    try {

      await api.post("/reports", {
        reporterId: currentUserId,
        reportedUserId: userId,
        reason: reportReason,
        description: reportDescription
      })

      alert("Report submitted")

      setReportReason("")
      setReportDescription("")

    } catch (err) {
      console.error(err)
      alert("Failed to submit report")
    }

  }

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
        {(profile.interests || []).map((interest, index) => (
          <li key={index}>{interest}</li>
        ))}
      </ul>

      <p>Lifestyle: {profile.lifestyle}</p>

      <p>Relationship Goals: {profile.relationshipGoals}</p>

      <h3>Photos</h3>

      {(profile.photos || []).map((photo, index) => (
        <img key={index} src={photo} width="200" alt="profile" />
      ))}

      <hr />

      <h3>Report User</h3>

      <select
        value={reportReason}
        onChange={(e) => setReportReason(e.target.value)}
      >
        <option value="">Select reason</option>
        <option value="spam">Spam</option>
        <option value="fake_profile">Fake Profile</option>
        <option value="harassment">Harassment</option>
        <option value="inappropriate_content">Inappropriate Content</option>
      </select>

      <br /><br />

      <textarea
        placeholder="Additional details (optional)"
        value={reportDescription}
        onChange={(e) => setReportDescription(e.target.value)}
      />

      <br /><br />

      <button onClick={handleReport}>
        Submit Report
      </button>

    </>
  )
}