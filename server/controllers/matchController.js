import Match from "../models/Match.js"
import Message from "../models/Message.js"


export const getMatches = async (req, res) => {
  try {

    const { userId } = req.params

    const matches = await Match.find({
      users: userId
    }).populate("users", "email gender")

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