import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext"

export default function Favorites() {
  const { userId } = useAuth()
  const navigate = useNavigate()

  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return

      try {
        const res = await api.get(`/favorites/${userId}`)
        setFavorites(res.data || [])
      } catch (error) {
        console.error("Favorites fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [userId])

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Favorites</h1>

        {loading && <p>Loading favorites...</p>}

        {!loading && favorites.length === 0 && (
          <p>No favorites yet</p>
        )}

        {!loading &&
          favorites.map((fav) => {
            const profile = fav.profileId

            if (!profile) return null

            return (
              <div
                key={fav._id}
                onClick={() => navigate(`/profile/${profile.userId}`)}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  marginBottom: "12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  maxWidth: "350px"
                }}
              >
                {profile.photos && profile.photos.length > 0 && (
                  <img
                    src={profile.photos[0]}
                    alt={profile.name}
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      marginBottom: "10px"
                    }}
                  />
                )}

                <h3>{profile.name}</h3>
                <p>Age: {profile.age}</p>
                <p>{profile.bio}</p>
              </div>
            )
          })}
      </div>
    </>
  )
}