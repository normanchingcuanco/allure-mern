import Like from "../models/Like.js"
import Match from "../models/Match.js"

export const sendLike = async (req, res) => {
  try {

    const { senderId, receiverId } = req.body

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot like yourself" })
    }

    /* Prevent duplicate like */

    const existingLike = await Like.findOne({ senderId, receiverId })

    if (existingLike) {
      return res.status(400).json({ message: "Already liked this user" })
    }

    /* Rate limit: 30 likes/hour */

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

    const recentLikes = await Like.countDocuments({
      senderId,
      createdAt: { $gte: oneHourAgo }
    })

    if (recentLikes >= 30) {
      return res.status(429).json({
        message: "Too many likes. Please try again later."
      })
    }

    /* Save like */

    const like = new Like({ senderId, receiverId })
    await like.save()

    /* Check reciprocal like */

    const reverseLike = await Like.findOne({
      senderId: receiverId,
      receiverId: senderId
    })

    let match = null

    if (reverseLike) {

      const existingMatch = await Match.findOne({
        users: { $all: [senderId, receiverId] }
      })

      if (!existingMatch) {

        match = new Match({
          users: [senderId, receiverId]
        })

        await match.save()

      } else {
        match = existingMatch
      }
    }

    return res.status(201).json({
      message: match ? "It's a match!" : "Like sent",
      like,
      match
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Server error"
    })

  }
}

export const getLikes = async (req, res) => {
  try {

    const likes = await Like.find()

    res.json(likes)

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    })

  }
}

export const getReceivedLikes = async (req, res) => {
  try {

    const { userId } = req.params

    const likes = await Like.find({
      receiverId: userId
    }).populate("senderId", "email gender")

    res.json(likes)

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    })

  }
}

export const getIncomingLikes = async (req, res) => {
  try {

    const { userId } = req.params

    const likes = await Like.find({
      receiverId: userId
    }).populate("senderId", "email")

    res.json(likes)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Failed to fetch incoming likes"
    })

  }
}

export const unlike = async (req, res) => {
  try {

    const { senderId, receiverId } = req.body

    await Like.findOneAndDelete({
      senderId,
      receiverId
    })

    res.json({
      message: "Like removed"
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    })

  }
}