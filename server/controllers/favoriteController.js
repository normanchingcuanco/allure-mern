import Favorite from "../models/Favorite.js"

export const addFavorite = async (req, res) => {
  try {

    const { userId, profileId } = req.body

    const existingFavorite = await Favorite.findOne({
      userId,
      profileId
    })

    if (existingFavorite) {
      return res.status(400).json({
        message: "Profile already in favorites"
      })
    }

    const favorite = new Favorite({
      userId,
      profileId
    })

    await favorite.save()

    res.status(201).json({
      message: "Profile added to favorites",
      favorite
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