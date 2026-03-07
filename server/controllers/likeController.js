import Like from "../models/Like.js"

export const sendLike = async (req, res) => {
  try {

    const { senderId, receiverId } = req.body

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot like yourself" })
    }

    const existingLike = await Like.findOne({ senderId, receiverId })

    if (existingLike) {
      return res.status(400).json({ message: "Already liked this user" })
    }

    const like = new Like({
      senderId,
      receiverId
    })

    await like.save()

    res.status(201).json({
      message: "Like sent",
      like
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}



export const getLikes = async (req, res) => {
  try {

    const likes = await Like.find()

    res.json(likes)

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}