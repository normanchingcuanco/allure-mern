import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"

export default function Profile() {
  const { userId } = useParams()

  const [profile, setProfile] = useState(null)
  const [reportReason, setReportReason] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [message, setMessage] = useState("")
  const [blocking, setBlocking] = useState(false)
  const [sendingRequest, setSendingRequest] = useState(false)

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

  const sendMessageRequest = async () => {
    if (!message.trim()) {
      alert("Please enter a message")
      return
    }

    try {
      setSendingRequest(true)

      await api.post("/message-requests", {
        senderId: currentUserId,
        receiverId: userId,
        message: message.trim()
      })

      alert("Message request sent")
      setMessage("")
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || "Failed to send message request")
    } finally {
      setSendingRequest(false)
    }
  }

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
        description: reportDescription.trim()
      })

      alert("Report submitted")

      setReportReason("")
      setReportDescription("")
    } catch (err) {
      console.error(err)
      alert("Failed to submit report")
    }
  }

  const blockUser = async () => {
    if (!window.confirm("Are you sure you want to block this user?")) return

    try {
      setBlocking(true)

      await api.post("/blocks", {
        blockerId: currentUserId,
        blockedId: userId
      })

      alert("User blocked")
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || "Failed to block user")
    } finally {
      setBlocking(false)
    }
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <p>Loading...</p>
      </>
    )
  }

  // ✅ UPDATED BLOCK
  if (currentUserId === userId) {
    return (
      <>
        <Navbar />

        <h2>This is your profile</h2>

        {profile?.isVerified ? (
          <p style={{ color: "green", fontWeight: "600" }}>
            ✅ Your profile is verified
          </p>
        ) : (
          <p style={{ color: "#999" }}>
            Your profile is not verified yet. Go to Verification to submit.
          </p>
        )}
      </>
    )
  }

  return (
    <>
      <Navbar />

      <h1>
        {profile.name}{" "}
        {profile.isVerified && (
          <span
            style={{
              display: "inline-block",
              marginLeft: "10px",
              padding: "4px 10px",
              backgroundColor: "#e6f4ea",
              color: "#137333",
              border: "1px solid #b7dfc2",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: "600",
              verticalAlign: "middle"
            }}
          >
            ✅ Verified
          </span>
        )}
      </h1>

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
        <img
          key={`${photo}-${index}`}
          src={photo}
          width="200"
          alt="profile"
        />
      ))}

      <hr />

      <h3>Send Message Request</h3>

      <textarea
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <br /><br />

      <button onClick={sendMessageRequest} disabled={sendingRequest}>
        {sendingRequest ? "Sending..." : "Send Message Request"}
      </button>

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

      <hr />

      <h3>Safety</h3>

      <button
        onClick={blockUser}
        disabled={blocking}
        style={{
          background: "#ff4d4f",
          color: "white",
          padding: "10px",
          borderRadius: "6px"
        }}
      >
        {blocking ? "Blocking..." : "Block User"}
      </button>
    </>
  )
}