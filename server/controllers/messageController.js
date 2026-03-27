import mongoose from "mongoose"
import Message from "../models/Message.js"
import Match from "../models/Match.js"

const isUserInMatch = (match, userId) => {
  return match.users.some(user => user.toString() === userId.toString())
}

export const sendMessage = async (req, res) => {
  try {
    const { matchId, senderId, text } = req.body

    if (!matchId || !senderId || !text) {
      return res.status(400).json({
        message: "Missing required fields"
      })
    }

    const match = await Match.findById(matchId)

    if (!match) {
      return res.status(404).json({
        message: "Match not found"
      })
    }

    if (!isUserInMatch(match, senderId)) {
      return res.status(403).json({
        message: "Not authorized for this match"
      })
    }

    const receiverId = match.users.find(
      user => user.toString() !== senderId.toString()
    )

    const message = await Message.create({
      matchId,
      senderId,
      receiverId,
      text
    })

    await Match.findByIdAndUpdate(matchId, {
      updatedAt: new Date()
    })

    res.json({
      success: true,
      data: message
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error"
    })
  }
}

export const getMessages = async (req, res) => {
  try {
    const { matchId } = req.params
    const { userId } = req.query

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      })
    }

    const match = await Match.findById(matchId)

    if (!match) {
      return res.status(404).json({
        message: "Match not found"
      })
    }

    if (!isUserInMatch(match, userId)) {
      return res.status(403).json({
        message: "Not authorized for this match"
      })
    }

    const messages = await Message.find({ matchId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.json(messages.reverse())
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error"
    })
  }
}

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      })
    }

    const message = await Message.findById(messageId)

    if (!message) {
      return res.status(404).json({
        message: "Message not found"
      })
    }

    const match = await Match.findById(message.matchId)

    if (!match) {
      return res.status(404).json({
        message: "Match not found"
      })
    }

    if (!isUserInMatch(match, userId)) {
      return res.status(403).json({
        message: "Not authorized for this match"
      })
    }

    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You can only delete your own messages"
      })
    }

    await Message.findByIdAndDelete(messageId)

    res.json({
      message: "Message deleted"
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error"
    })
  }
}

export const markMessagesAsRead = async (req, res) => {
  try {
    const { matchId, userId } = req.body

    if (!matchId || !userId) {
      return res.status(400).json({
        message: "Match ID and User ID are required"
      })
    }

    const match = await Match.findById(matchId)

    if (!match) {
      return res.status(404).json({
        message: "Match not found"
      })
    }

    if (!isUserInMatch(match, userId)) {
      return res.status(403).json({
        message: "Not authorized for this match"
      })
    }

    const matchObjectId = new mongoose.Types.ObjectId(matchId)
    const userObjectId = new mongoose.Types.ObjectId(userId)

    const result = await Message.updateMany(
      {
        matchId: matchObjectId,
        senderId: { $ne: userObjectId },
        read: false
      },
      {
        $set: { read: true }
      }
    )

    res.json({
      success: true,
      messagesMarkedRead: result.modifiedCount
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error"
    })
  }
}