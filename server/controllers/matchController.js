import Match from "../models/Match.js"
import Message from "../models/Message.js"

export const getUserMatches = async (req, res) => {
  try {

    const { userId } = req.params

    const matches = await Match.find({
      users: userId
    }).populate("users", "email")

    const results = []

    for (const match of matches) {

      const otherUser = match.users.find(
        user => user._id.toString() !== userId
      )

      const lastMessage = await Message.findOne({
        matchId: match._id
      }).sort({ createdAt: -1 })

      results.push({
        matchId: match._id,
        user: otherUser,
        lastMessage: lastMessage ? lastMessage.text : null,
        lastMessageTime: lastMessage ? lastMessage.createdAt : null
      })
    }

    res.json(results)

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}