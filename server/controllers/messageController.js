import Message from "../models/Message.js"
import Match from "../models/Match.js"

export const sendMessage = async (req, res) => {
  try {

    const { matchId, senderId, receiverId, text } = req.body

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text required" })
    }

    const match = await Match.findById(matchId)

    if (!match) {
      return res.status(404).json({ message: "Match not found" })
    }

    const users = match.users.map(u => u.toString())

    const isParticipant =
      users.includes(senderId) &&
      users.includes(receiverId)

    if (!isParticipant) {
      return res.status(403).json({
        message: "Users are not part of this match"
      })
    }

    const message = new Message({
      matchId,
      senderId,
      receiverId,
      text
    })

    await message.save()

    res.status(201).json({
      message: "Message sent",
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

    const messages = await Message
      .find({ matchId })
      .populate("senderId", "email")
      .sort({ createdAt: 1 })

    res.json(messages)

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

    const message = await Message.findByIdAndDelete(messageId)

    if (!message) {
      return res.status(404).json({
        message: "Message not found"
      })
    }

    res.json({
      message: "Message deleted"
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    })

  }
}