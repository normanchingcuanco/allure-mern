import { useEffect, useState } from "react"
import axios from "axios"

export default function Favorites() {
  const [favorites, setFavorites] = useState([])

  const userId = localStorage.getItem("userId")

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/favorites/${userId}`
    )

    setFavorites(res.data)
  }

  return (
    <div>
      <h2>Favorite Profiles</h2>

      {favorites.length === 0 && <p>No favorites yet</p>}

      {favorites.map((fav) => (
        <div key={fav._id} style={{border:"1px solid #ccc", padding:"10px", marginBottom:"10px"}}>
          <p><strong>{fav.profile?.name}</strong></p>
          <p>{fav.profile?.bio}</p>
        </div>
      ))}
    </div>
  )
}