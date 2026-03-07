import Like from "../models/Like.js"
import Match from "../models/Match.js"

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

    // CHECK IF RECEIVER ALREADY LIKED SENDER
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

    res.status(201).json({
      message: match ? "It's a match!" : "Like sent",
      like,
      match
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


export const getReceivedLikes = async (req, res) => {
  try {

    const { userId } = req.params

    const likes = await Like.find({
      receiverId: userId
    }).populate("senderId", "email")

    res.json(likes)

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}