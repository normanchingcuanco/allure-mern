import Favorite from "../models/Favorite.js"

export const addFavorite = async (req, res) => {
  try {
    const { userId, profileId } = req.body

    if (!userId || !profileId) {
      return res.status(400).json({
        message: "User ID and Profile ID are required"
      })
    }

    const existingFavorite = await Favorite.findOne({
      userId,
      profileId
    })

    if (existingFavorite) {
      await Favorite.findByIdAndDelete(existingFavorite._id)

      return res.json({
        message: "Profile removed from favorites",
        isFavorited: false
      })
    }

    const favorite = new Favorite({
      userId,
      profileId
    })

    await favorite.save()

    res.status(201).json({
      message: "Profile added to favorites",
      favorite,
      isFavorited: true
    })
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    })
  }
}

export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.params

    const favorites = await Favorite.find({
      userId
    }).populate("profileId")

    res.json(favorites)
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    })
  }
}