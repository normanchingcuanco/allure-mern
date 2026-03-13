import Match from "../models/Match.js"
import Message from "../models/Message.js"
import Profile from "../models/Profile.js"
import mongoose from "mongoose"


export const getMatches = async (req, res) => {
  try {

    const { userId } = req.params

    const userObjectId = new mongoose.Types.ObjectId(userId)

    const matches = await Match.find({
      users: userObjectId
    })
    .sort({ updatedAt: -1 })

    const results = []

    for (const match of matches) {

      const otherUserId = match.users.find(
        id => id.toString() !== userId
      )

      const profile = await Profile.findOne({
        userId: otherUserId
      })

      const lastMessage = await Message.findOne({
        matchId: match._id
      }).sort({ createdAt: -1 })

      const unreadCount = await Message.countDocuments({
        matchId: match._id,
        senderId: { $ne: userId },
        read: false
      })

      results.push({
        matchId: match._id,
        name: profile ? profile.name : "Unknown",
        photo: profile && profile.photos.length ? profile.photos[0] : null,
        lastMessage: lastMessage ? lastMessage.text : null,
        lastMessageTime: lastMessage ? lastMessage.createdAt : null,
        unreadCount
      })

    }

    res.json(results)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Server error"
    })

  }
}


export const unmatch = async (req, res) => {
  try {

    const { matchId } = req.params

    const match = await Match.findByIdAndDelete(matchId)

    if (!match) {
      return res.status(404).json({
        message: "Match not found"
      })
    }

    res.json({
      message: "Match removed"
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Server error"
    })

  }
}