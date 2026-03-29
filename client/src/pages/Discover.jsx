import { useEffect, useState } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"

const initialFilters = {
  minAge: "",
  maxAge: "",
  interests: "",
  lifestyle: "",
  relationshipGoals: ""
}

export default function Discover() {
  const auth = useAuth()
  const userId = auth?.userId || localStorage.getItem("userId")

  const [profiles, setProfiles] = useState([])
  const [incomingLikes, setIncomingLikes] = useState([])
  const [mode, setMode] = useState("")
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(initialFilters)
  const [favoritedProfileIds, setFavoritedProfileIds] = useState([])
  const [favoriteLoadingIds, setFavoriteLoadingIds] = useState([])

  const navigate = useNavigate()

  const fetchFavorites = async () => {
    if (!userId) return

    try {
      const res = await api.get(`/favorites/${userId}`)

      const ids = Array.isArray(res.data)
        ? res.data
            .map(item => item?.profileId?._id || item?.profileId)
            .filter(Boolean)
        : []

      setFavoritedProfileIds(ids.map(id => id.toString()))
    } catch (err) {
      console.error("Favorites fetch error:", err)
    }
  }

  const fetchProfiles = async (activeFilters = filters, showLoader = true) => {
    if (!userId) {
      setLoading(false)
      return
    }

    if (showLoader) {
      setLoading(true)
    }

    try {
      const params = {}

      if (activeFilters.minAge) {
        params.minAge = activeFilters.minAge
      }

      if (activeFilters.maxAge) {
        params.maxAge = activeFilters.maxAge
      }

      if (activeFilters.interests.trim()) {
        params.interests = activeFilters.interests
      }

      if (activeFilters.lifestyle.trim()) {
        params.lifestyle = activeFilters.lifestyle
      }

      if (activeFilters.relationshipGoals.trim()) {
        params.relationshipGoals = activeFilters.relationshipGoals
      }

      const res = await api.get(`/profiles/discover/${userId}`, { params })

      setMode(res.data?.mode || "")

      if (res.data?.mode === "browse") {
        setProfiles(Array.isArray(res.data.profiles) ? res.data.profiles : [])
        setIncomingLikes([])
      } else if (res.data?.mode === "incoming_likes") {
        setIncomingLikes(Array.isArray(res.data.likes) ? res.data.likes : [])
        setProfiles([])
      } else {
        setProfiles([])
        setIncomingLikes([])
      }
    } catch (err) {
      console.error("Discover fetch error:", err)
      setProfiles([])
      setIncomingLikes([])
      setMode("")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    fetchProfiles(initialFilters)
    fetchFavorites()
  }, [userId])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleApplyFilters = async (e) => {
    e.preventDefault()
    await fetchProfiles(filters)
  }

  const handleResetFilters = async () => {
    setFilters(initialFilters)
    await fetchProfiles(initialFilters)
  }

  const handleLike = async (receiverId) => {
    try {
      const res = await api.post("/likes", {
        senderId: userId,
        receiverId
      })

      if (res.data?.isMatch) {
        alert("It's a match!")
      } else {
        alert("Like sent")
      }

      setProfiles(prev =>
        prev.filter(profile => profile?.userId?._id !== receiverId)
      )
    } catch (err) {
      console.error("Like error:", err)
      alert(err.response?.data?.message || "Failed to send like")
    }
  }

  const handleFavoriteToggle = async (profileId) => {
    if (favoriteLoadingIds.includes(profileId)) return

    try {
      setFavoriteLoadingIds(prev => [...prev, profileId])

      const res = await api.post("/favorites", {
        userId,
        profileId
      })

      const isFavorited = res.data?.isFavorited

      setFavoritedProfileIds(prev => {
        const exists = prev.includes(profileId)

        if (isFavorited === true && !exists) {
          return [...prev, profileId]
        }

        if (isFavorited === false) {
          return prev.filter(id => id !== profileId)
        }

        return prev
      })

      alert(res.data?.message || "Favorite updated")
    } catch (err) {
      console.error("Favorite toggle error:", err)
      alert(err.response?.data?.message || "Failed to update favorite")
    } finally {
      setFavoriteLoadingIds(prev => prev.filter(id => id !== profileId))
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <h2>Loading profiles...</h2>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Discover</h1>

        <p>Mode: {mode || "unknown"}</p>

        {mode === "browse" && (
          <form
            onSubmit={handleApplyFilters}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "20px",
              maxWidth: "600px"
            }}
          >
            <h3 style={{ marginTop: 0 }}>Filters</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px"
              }}
            >
              <div>
                <label>Min Age</label>
                <input
                  type="number"
                  name="minAge"
                  value={filters.minAge}
                  onChange={handleChange}
                  min="18"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              <div>
                <label>Max Age</label>
                <input
                  type="number"
                  name="maxAge"
                  value={filters.maxAge}
                  onChange={handleChange}
                  min="18"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              <div>
                <label>Interests</label>
                <input
                  type="text"
                  name="interests"
                  value={filters.interests}
                  onChange={handleChange}
                  placeholder="travel, music, fitness"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              <div>
                <label>Lifestyle</label>
                <input
                  type="text"
                  name="lifestyle"
                  value={filters.lifestyle}
                  onChange={handleChange}
                  placeholder="active"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              <div>
                <label>Relationship Goals</label>
                <input
                  type="text"
                  name="relationshipGoals"
                  value={filters.relationshipGoals}
                  onChange={handleChange}
                  placeholder="serious relationship"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>
            </div>

            <p style={{ fontSize: "14px", color: "#666", marginTop: "12px" }}>
              Use commas for multiple interests or multiple lifestyle / relationship goal values.
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="submit">Apply Filters</button>
              <button type="button" onClick={handleResetFilters}>
                Reset
              </button>
            </div>
          </form>
        )}

        {mode === "incoming_likes" && (
          <div style={{ marginBottom: "20px" }}>
            <h3>Incoming Likes</h3>

            {incomingLikes.length === 0 && (
              <p>No incoming likes yet</p>
            )}

            {incomingLikes.map(like => (
              <div
                key={like._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "15px",
                  marginBottom: "20px",
                  maxWidth: "400px"
                }}
              >
                <p>
                  <strong>From:</strong> {like?.senderId?.email || "User"}
                </p>
              </div>
            ))}
          </div>
        )}

        {mode === "browse" && profiles.length === 0 && (
          <p>No profiles available</p>
        )}

        {mode === "browse" && profiles.map(profile => {
          if (!profile?.userId) return null

          const isFavorited = favoritedProfileIds.includes(profile._id.toString())
          const isFavoriteLoading = favoriteLoadingIds.includes(profile._id.toString())

          return (
            <div
              key={profile._id}
              onClick={() => navigate(`/profile/${profile.userId._id}`)}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "20px",
                maxWidth: "400px",
                cursor: "pointer"
              }}
            >
              {profile.photos && profile.photos.length > 0 && (
                <img
                  src={profile.photos[0]}
                  alt={profile.name}
                  style={{
                    width: "100%",
                    borderRadius: "10px"
                  }}
                />
              )}

              <h3 style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span>{profile.name}</span>

                {profile.isVerified && (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      backgroundColor: "#e6f4ea",
                      color: "#137333",
                      border: "1px solid #b7dfc2",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}
                  >
                    ✅ Verified
                  </span>
                )}
              </h3>

              <p>Age: {profile.age}</p>
              <p>{profile.bio}</p>

              {profile.interests?.length > 0 && (
                <p>
                  <strong>Interests:</strong> {profile.interests.join(", ")}
                </p>
              )}

              {profile.lifestyle && (
                <p>
                  <strong>Lifestyle:</strong> {profile.lifestyle}
                </p>
              )}

              {profile.relationshipGoals && (
                <p>
                  <strong>Relationship Goals:</strong> {profile.relationshipGoals}
                </p>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLike(profile.userId._id)
                  }}
                >
                  Like
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFavoriteToggle(profile._id.toString())
                  }}
                  disabled={isFavoriteLoading}
                >
                  {isFavoriteLoading
                    ? "Updating..."
                    : isFavorited
                      ? "Unfavorite"
                      : "Favorite"}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}