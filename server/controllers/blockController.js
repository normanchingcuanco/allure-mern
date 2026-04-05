import mongoose from "mongoose"
import Block from "../models/Block.js"
import Favorite from "../models/Favorite.js"
import Like from "../models/Like.js"
import Match from "../models/Match.js"
import Message from "../models/Message.js"
import MessageRequest from "../models/MessageRequest.js"
import Profile from "../models/Profile.js"
import User from "../models/User.js"
import { emitToUsers } from "../socket.js"

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value)

export const blockUser = async (req, res) => {
  try {
    const { blockerId, blockedId } = req.body

    if (!blockerId || !blockedId) {
      return res.status(400).json({
        message: "Blocker ID and blocked ID are required"
      })
    }

    if (!isValidObjectId(blockerId) || !isValidObjectId(blockedId)) {
      return res.status(400).json({
        message: "Invalid blocker ID or blocked ID"
      })
    }

    if (blockerId === blockedId) {
      return res.status(400).json({
        message: "You cannot block yourself"
      })
    }

    const [blockerUser, blockedUser] = await Promise.all([
      User.findById(blockerId),
      User.findById(blockedId)
    ])

    if (!blockerUser || !blockedUser) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const existingBlock = await Block.findOne({
      blockerId,
      blockedId
    })

    if (existingBlock) {
      return res.status(400).json({
        message: "User already blocked"
      })
    }

    const block = new Block({
      blockerId,
      blockedId
    })

    await block.save()

    const participantIds = [blockerId.toString(), blockedId.toString()]

    const [blockerProfile, blockedProfile] = await Promise.all([
      Profile.findOne({ userId: blockerId }).select("_id"),
      Profile.findOne({ userId: blockedId }).select("_id")
    ])

    const existingMatch = await Match.findOne({
      users: { $all: participantIds }
    })

    if (existingMatch) {
      await Message.deleteMany({
        matchId: existingMatch._id
      })

      await Match.findByIdAndDelete(existingMatch._id)
    }

    await Like.deleteMany({
      $or: [
        {
          senderId: blockerId,
          receiverId: blockedId
        },
        {
          senderId: blockedId,
          receiverId: blockerId
        }
      ]
    })

    await MessageRequest.deleteMany({
      $or: [
        {
          senderId: blockerId,
          receiverId: blockedId
        },
        {
          senderId: blockedId,
          receiverId: blockerId
        },
        {
          sender: blockerId,
          receiver: blockedId
        },
        {
          sender: blockedId,
          receiver: blockerId
        }
      ]
    })

    const favoriteDeleteConditions = []

    if (blockedProfile?._id) {
      favoriteDeleteConditions.push({
        userId: blockerId,
        profileId: blockedProfile._id
      })
    }

    if (blockerProfile?._id) {
      favoriteDeleteConditions.push({
        userId: blockedId,
        profileId: blockerProfile._id
      })
    }

    if (favoriteDeleteConditions.length > 0) {
      await Favorite.deleteMany({
        $or: favoriteDeleteConditions
      })
    }

    emitToUsers(participantIds, "notifications_refresh", {
      type: "user_blocked",
      blockerId: blockerId.toString(),
      blockedId: blockedId.toString()
    })

    res.status(201).json({
      message: "User blocked successfully",
      block
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error"
    })
  }
}

export const getBlockedUsers = async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Valid user ID is required"
      })
    }

    const blockedUsers = await Block.find({
      blockerId: userId
    }).populate("blockedId", "email")

    res.json(blockedUsers)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error"
    })
  }
}

export const unblockUser = async (req, res) => {
  try {
    const { blockId } = req.params

    if (!blockId || !isValidObjectId(blockId)) {
      return res.status(400).json({
        message: "Valid block ID is required"
      })
    }

    const block = await Block.findByIdAndDelete(blockId)

    if (!block) {
      return res.status(404).json({
        message: "Block record not found"
      })
    }

    emitToUsers(
      [block.blockerId.toString(), block.blockedId.toString()],
      "notifications_refresh",
      {
        type: "user_unblocked",
        blockerId: block.blockerId.toString(),
        blockedId: block.blockedId.toString()
      }
    )

    res.json({
      message: "User unblocked successfully"
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error"
    })
  }
}