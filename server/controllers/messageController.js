import Message from "../models/Message.js"
import Match from "../models/Match.js"

export const sendMessage = async (req, res) => {
  try {

    const { matchId, senderId, receiverId, text } = req.body

    const match = await Match.findById(matchId)

    if (!match) {
      return res.status(404).json({ message: "Match not found" })
    }

    const isParticipant = match.users.includes(senderId) && match.users.includes(receiverId)

    if (!isParticipant) {
      return res.status(403).json({ message: "Users are not part of this match" })
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

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}



export const getMessages = async (req, res) => {
  try {

    const { matchId } = req.params

    const messages = await Message.find({ matchId }).sort({ createdAt: 1 })

    res.json(messages)

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}