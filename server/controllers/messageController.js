import mongoose from "mongoose"
import Message from "../models/Message.js"
import Match from "../models/Match.js"
import { emitToMatch, emitToUsers } from "../socket.js"

const isUserInMatch = (match, userId) => {
  return match.users.some((user) => user.toString() === userId.toString())
}

const emitNotificationRefresh = (userIds = [], payload = {}) => {
  emitToUsers(userIds, "notifications_refresh", payload)
}

export const sendMessage = async (req, res) => {
  try {
    const { matchId, senderId, text } = req.body

    const trimmedText = text?.trim()

    if (!matchId || !senderId || !trimmedText) {
      return res.status(400).json({
        message: "Match ID, sender ID, and text are required"
      })
    }

    if (
      !mongoose.Types.ObjectId.isValid(matchId) ||
      !mongoose.Types.ObjectId.isValid(senderId)
    ) {
      return res.status(400).json({
        message: "Invalid match ID or sender ID"
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
      (user) => user.toString() !== senderId.toString()
    )

    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver not found for this match"
      })
    }

    const message = await Message.create({
      matchId,
      senderId,
      receiverId,
      text: trimmedText,
      read: false
    })

    await Match.findByIdAndUpdate(matchId, {
      updatedAt: new Date()
    })

    emitToMatch(matchId, "receive_message", {
      matchId: matchId.toString(),
      message
    })

    emitNotificationRefresh([receiverId], {
      type: "new_message",
      matchId: matchId.toString(),
      senderId: senderId.toString()
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

    if (
      !mongoose.Types.ObjectId.isValid(matchId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
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

    if (!isUserInMatch(match, userId)) {
      return res.status(403).json({
        message: "Not authorized for this match"
      })
    }

    const messages = await Message.find({ matchId })
      .sort({ createdAt: -1, _id: -1 })
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

    if (
      !mongoose.Types.ObjectId.isValid(messageId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        message: "Invalid message ID or user ID"
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

    emitNotificationRefresh(match.users, {
      type: "message_deleted",
      matchId: match._id.toString()
    })

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
        message: "Match ID and user ID are required"
      })
    }

    if (
      !mongoose.Types.ObjectId.isValid(matchId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
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

    if (!isUserInMatch(match, userId)) {
      return res.status(403).json({
        message: "Not authorized for this match"
      })
    }

    const result = await Message.updateMany(
      {
        matchId: new mongoose.Types.ObjectId(matchId),
        receiverId: new mongoose.Types.ObjectId(userId),
        read: false
      },
      {
        $set: { read: true }
      }
    )

    emitNotificationRefresh(match.users, {
      type: "messages_read",
      matchId: match._id.toString(),
      readerId: userId.toString()
    })

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

export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params

    const count = await Message.countDocuments({
      receiverId: new mongoose.Types.ObjectId(userId),
      read: false
    })

    res.json({ count })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Failed to fetch unread count"
    })
  }
}