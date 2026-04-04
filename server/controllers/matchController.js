import mongoose from "mongoose"
import Match from "../models/Match.js"
import Message from "../models/Message.js"
import User from "../models/User.js"
import Like from "../models/Like.js"
import { emitToUsers } from "../socket.js"

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value)

export const getMatches = async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      })
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID"
      })
    }

    const currentUser = await User.findById(userId)

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    if (currentUser.isSuspended) {
      return res.status(403).json({
        message: "Your account has been suspended"
      })
    }

    const matches = await Match.find({
      users: new mongoose.Types.ObjectId(userId)
    })
      .populate("users", "email isSuspended")
      .sort({ updatedAt: -1, _id: -1 })

    const activeMatches = matches.filter(match => {
      return match.users.every(user => user && user.isSuspended !== true)
    })

    const enrichedMatches = await Promise.all(
      activeMatches.map(async (match) => {
        const otherUser = match.users.find(
          (user) => user._id.toString() !== userId.toString()
        )

        const lastMessage = await Message.findOne({ matchId: match._id })
          .sort({ createdAt: -1, _id: -1 })
          .select("text senderId receiverId read createdAt")

        const unreadCount = await Message.countDocuments({
          matchId: match._id,
          receiverId: new mongoose.Types.ObjectId(userId),
          read: false
        })

        return {
          ...match.toObject(),
          otherUser: otherUser || null,
          lastMessage: lastMessage || null,
          unreadCount
        }
      })
    )

    enrichedMatches.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt
        ? new Date(a.lastMessage.createdAt).getTime()
        : new Date(a.updatedAt).getTime()

      const bTime = b.lastMessage?.createdAt
        ? new Date(b.lastMessage.createdAt).getTime()
        : new Date(b.updatedAt).getTime()

      return bTime - aTime
    })

    res.json(enrichedMatches)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error"
    })
  }
}

export const unmatchUsers = async (req, res) => {
  try {
    const { matchId } = req.params
    const { userId } = req.body

    if (!matchId || !userId) {
      return res.status(400).json({
        message: "Match ID and user ID are required"
      })
    }

    if (!isValidObjectId(matchId) || !isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid match ID or user ID"
      })
    }

    const match = await Match.findById(matchId)

    if (!match) {
      return res.status(404).json({
        message: "Match not found"
      })
    }

    const isParticipant = match.users.some(
      (user) => user.toString() === userId.toString()
    )

    if (!isParticipant) {
      return res.status(403).json({
        message: "Not authorized for this match"
      })
    }

    const participantIds = match.users.map((id) => id.toString())

    await Message.deleteMany({ matchId: match._id })

    await Like.deleteMany({
      $or: [
        {
          senderId: participantIds[0],
          receiverId: participantIds[1]
        },
        {
          senderId: participantIds[1],
          receiverId: participantIds[0]
        }
      ]
    })

    await Match.findByIdAndDelete(matchId)

    emitToUsers(participantIds, "notifications_refresh", {
      type: "match_removed",
      matchId
    })

    res.json({
      message: "Unmatched successfully"
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error"
    })
  }
}

export const getNewMatchesCount = async (req, res) => {
  try {
    const { userId } = req.params

    const matches = await Match.find({
      isNewFor: userId
    })

    res.json({
      count: matches.length
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error"
    })
  }
}

export const clearNewMatches = async (req, res) => {
  try {
    const { userId } = req.body

    await Match.updateMany(
      { isNewFor: userId },
      { $pull: { isNewFor: userId } }
    )

    res.json({
      message: "New matches cleared"
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error"
    })
  }
}