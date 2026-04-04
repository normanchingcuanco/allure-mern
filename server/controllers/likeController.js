import Like from "../models/Like.js"
import Match from "../models/Match.js"
import User from "../models/User.js"
import { emitToUsers } from "../socket.js"

const getMatchedUserIds = async (userId) => {
  const matches = await Match.find({
    users: userId
  }).select("users")

  const matchedUserIds = matches.flatMap((match) =>
    match.users
      .map((id) => id.toString())
      .filter((id) => id !== userId.toString())
  )

  return matchedUserIds
}

const emitNotificationRefresh = (userIds = [], payload = {}) => {
  emitToUsers(userIds, "notifications_refresh", payload)
}

export const sendLike = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot like yourself" })
    }

    const sender = await User.findById(senderId)
    const receiver = await User.findById(receiverId)

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" })
    }

    if (sender.isSuspended) {
      return res.status(403).json({ message: "Your account has been suspended" })
    }

    if (receiver.isSuspended) {
      return res.status(403).json({ message: "You cannot like this user" })
    }

    const existingMatch = await Match.findOne({
      users: { $all: [senderId, receiverId] }
    })

    if (existingMatch) {
      if (!existingMatch.isNewFor) {
        existingMatch.isNewFor = []
      }

      await existingMatch.save()

      return res.status(200).json({
        message: "Already matched",
        match: existingMatch
      })
    }

    const existingLike = await Like.findOne({ senderId, receiverId })

    if (existingLike) {
      return res.status(400).json({ message: "Already liked this user" })
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

    const recentLikes = await Like.countDocuments({
      senderId,
      createdAt: { $gte: oneHourAgo }
    })

    if (recentLikes >= 30) {
      return res.status(429).json({
        message: "Too many likes. Please try again later."
      })
    }

    const like = new Like({ senderId, receiverId })
    await like.save()

    const reverseLike = await Like.findOne({
      senderId: receiverId,
      receiverId: senderId
    })

    let match = null

    if (reverseLike) {
      match = await Match.findOne({
        users: { $all: [senderId, receiverId] }
      })

      if (!match) {
        match = new Match({
          users: [senderId, receiverId],
          isNewFor: [senderId, receiverId]
        })

        await match.save()
      } else {
        const currentIds = (match.isNewFor || []).map((id) => id.toString())

        if (!currentIds.includes(senderId.toString())) {
          match.isNewFor.push(senderId)
        }

        if (!currentIds.includes(receiverId.toString())) {
          match.isNewFor.push(receiverId)
        }

        await match.save()
      }

      emitNotificationRefresh([senderId, receiverId], {
        type: "match_created",
        matchId: match._id.toString()
      })
    } else {
      emitNotificationRefresh([receiverId], {
        type: "incoming_like_received",
        senderId: senderId.toString()
      })
    }

    return res.status(201).json({
      message: match ? "It's a match!" : "Like sent",
      like,
      match
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error"
    })
  }
}

export const getLikes = async (req, res) => {
  try {
    const likes = await Like.find()

    res.json(likes)
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    })
  }
}

export const getReceivedLikes = async (req, res) => {
  try {
    const { userId } = req.params
    const matchedUserIds = await getMatchedUserIds(userId)

    const likes = await Like.find({
      receiverId: userId
    }).populate("senderId", "email gender isSuspended")

    const filteredLikes = likes.filter((like) => {
      if (!like.senderId) return false
      if (like.senderId.isSuspended === true) return false
      if (matchedUserIds.includes(like.senderId._id.toString())) return false
      return true
    })

    res.json(filteredLikes)
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    })
  }
}

export const getIncomingLikes = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    if (user.isSuspended) {
      return res.status(403).json({
        message: "Your account has been suspended"
      })
    }

    const matchedUserIds = await getMatchedUserIds(userId)

    const likes = await Like.find({
      receiverId: userId
    }).populate("senderId", "email isSuspended")

    const filteredLikes = likes.filter((like) => {
      if (!like.senderId) return false
      if (like.senderId.isSuspended === true) return false
      if (matchedUserIds.includes(like.senderId._id.toString())) return false
      return true
    })

    res.json(filteredLikes)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Failed to fetch incoming likes"
    })
  }
}

export const unlike = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body

    await Like.findOneAndDelete({
      senderId,
      receiverId
    })

    emitNotificationRefresh([receiverId], {
      type: "incoming_like_removed",
      senderId: senderId?.toString?.() || senderId
    })

    res.json({
      message: "Like removed"
    })
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    })
  }
}

export const getIncomingLikesCount = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    if (user.isSuspended) {
      return res.status(403).json({
        message: "Your account has been suspended"
      })
    }

    const matchedUserIds = await getMatchedUserIds(userId)

    const likes = await Like.find({
      receiverId: userId
    }).populate("senderId", "_id isSuspended")

    const count = likes.filter((like) => {
      if (!like.senderId) return false
      if (like.senderId.isSuspended === true) return false
      if (matchedUserIds.includes(like.senderId._id.toString())) return false
      return true
    }).length

    res.json({ count })
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch incoming likes count",
      error
    })
  }
}