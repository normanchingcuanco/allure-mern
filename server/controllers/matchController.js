import mongoose from "mongoose"
import Match from "../models/Match.js"
import Message from "../models/Message.js"
import Profile from "../models/Profile.js"

const isUserInMatch = (match, userId) => {
  return match.users.some(id => id.toString() === userId.toString())
}

export const getMatches = async (req, res) => {
  try {
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID"
      })
    }

    const userObjectId = new mongoose.Types.ObjectId(userId)

    const matches = await Match.find({
      users: userObjectId
    }).sort({ updatedAt: -1, createdAt: -1 })

    const results = []

    for (const match of matches) {
      const otherUserId = match.users.find(
        id => id.toString() !== userId.toString()
      )

      const profile = await Profile.findOne({
        userId: otherUserId
      })

      const messages = await Message.find({
        matchId: match._id
      }).sort({ createdAt: -1 })

      const lastMessage = messages.length > 0 ? messages[0] : null

      const unreadCount = messages.filter(message => {
        const senderId = message.senderId?.toString()
        const receiverId = message.receiverId?.toString()

        return (
          senderId !== userId.toString() &&
          receiverId === userId.toString() &&
          message.read === false
        )
      }).length

      const latestActivity =
        lastMessage?.createdAt || match.updatedAt || match.createdAt

      results.push({
        matchId: match._id,
        userId: otherUserId,
        name: profile ? profile.name : "Unknown",
        photo: profile && profile.photos.length ? profile.photos[0] : null,
        lastMessage: lastMessage ? lastMessage.text : null,
        lastMessageTime: lastMessage ? lastMessage.createdAt : null,
        latestActivity,
        unreadCount
      })
    }

    results.sort((a, b) => {
      const aTime = new Date(a.latestActivity || 0).getTime()
      const bTime = new Date(b.latestActivity || 0).getTime()
      return bTime - aTime
    })

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
    const { userId } = req.body

    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      return res.status(400).json({
        message: "Invalid match ID"
      })
    }

    const match = await Match.findById(matchId)

    if (!match) {
      return res.status(404).json({
        message: "Match not found"
      })
    }

    if (userId && !isUserInMatch(match, userId)) {
      return res.status(403).json({
        message: "Not authorized to unmatch"
      })
    }

    await Message.deleteMany({
      matchId
    })

    await Match.findByIdAndDelete(matchId)

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