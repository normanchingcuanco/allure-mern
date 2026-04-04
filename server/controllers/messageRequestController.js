import mongoose from "mongoose"
import MessageRequest from "../models/MessageRequest.js"
import Match from "../models/Match.js"
import Block from "../models/Block.js"
import { emitToUsers } from "../socket.js"

const emitNotificationRefresh = (userIds = [], payload = {}) => {
  emitToUsers(userIds, "notifications_refresh", payload)
}

export const sendMessageRequest = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body

    const trimmedMessage = message?.trim()

    if (!senderId || !receiverId || !trimmedMessage) {
      return res.status(400).json({
        message: "Sender, receiver, and message are required"
      })
    }

    if (senderId === receiverId) {
      return res.status(400).json({
        message: "You cannot message yourself"
      })
    }

    const blocked = await Block.findOne({
      $or: [
        { blockerId: senderId, blockedId: receiverId },
        { blockerId: receiverId, blockedId: senderId }
      ]
    })

    if (blocked) {
      return res.status(403).json({
        message: "You cannot message this user"
      })
    }

    const existingMatch = await Match.findOne({
      users: { $all: [senderId, receiverId] }
    })

    if (existingMatch) {
      return res.status(400).json({
        message: "You are already matched with this user"
      })
    }

    const existingOutgoingRequest = await MessageRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending"
    })

    if (existingOutgoingRequest) {
      return res.status(400).json({
        message: "Message request already sent"
      })
    }

    const existingIncomingRequest = await MessageRequest.findOne({
      sender: receiverId,
      receiver: senderId,
      status: "pending"
    })

    if (existingIncomingRequest) {
      return res.status(400).json({
        message: "This user already sent you a message request"
      })
    }

    const request = await MessageRequest.create({
      sender: senderId,
      receiver: receiverId,
      message: trimmedMessage
    })

    emitNotificationRefresh([receiverId], {
      type: "message_request_received",
      requestId: request._id.toString()
    })

    res.status(201).json(request)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Server error"
    })
  }
}

export const getIncomingRequests = async (req, res) => {
  try {
    const { userId } = req.params

    const requests = await MessageRequest.find({
      receiver: new mongoose.Types.ObjectId(userId),
      status: "pending"
    })
      .populate("sender", "username email")
      .sort({ createdAt: -1 })

    res.json(requests)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch requests" })
  }
}

export const getOutgoingRequests = async (req, res) => {
  try {
    const { userId } = req.params

    const requests = await MessageRequest.find({
      sender: new mongoose.Types.ObjectId(userId),
      status: "pending"
    })
      .populate("receiver", "username email")
      .sort({ createdAt: -1 })

    res.json(requests)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch outgoing requests" })
  }
}

export const getIncomingRequestsCount = async (req, res) => {
  try {
    const { userId } = req.params

    const count = await MessageRequest.countDocuments({
      receiver: new mongoose.Types.ObjectId(userId),
      status: "pending"
    })

    res.json({ count })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch request count" })
  }
}

export const acceptMessageRequest = async (req, res) => {
  try {
    const { requestId } = req.params

    const request = await MessageRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      })
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "This request is no longer pending"
      })
    }

    const blocked = await Block.findOne({
      $or: [
        { blockerId: request.sender, blockedId: request.receiver },
        { blockerId: request.receiver, blockedId: request.sender }
      ]
    })

    if (blocked) {
      return res.status(403).json({
        message: "You cannot accept this request"
      })
    }

    let match = await Match.findOne({
      users: { $all: [request.sender, request.receiver] }
    })

    if (!match) {
      match = await Match.create({
        users: [request.sender, request.receiver],
        isNewFor: [request.sender, request.receiver]
      })
    }

    request.status = "accepted"
    await request.save()

    await MessageRequest.updateMany(
      {
        _id: { $ne: request._id },
        status: "pending",
        $or: [
          { sender: request.sender, receiver: request.receiver },
          { sender: request.receiver, receiver: request.sender }
        ]
      },
      {
        status: "rejected"
      }
    )

    emitNotificationRefresh([request.sender, request.receiver], {
      type: "message_request_accepted",
      matchId: match._id.toString()
    })

    res.json(request)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to accept request" })
  }
}

export const rejectMessageRequest = async (req, res) => {
  try {
    const { requestId } = req.params

    const request = await MessageRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      })
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "This request is no longer pending"
      })
    }

    request.status = "rejected"
    await request.save()

    emitNotificationRefresh([request.sender, request.receiver], {
      type: "message_request_rejected",
      requestId: request._id.toString()
    })

    res.json(request)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to reject request" })
  }
}

export const cancelMessageRequest = async (req, res) => {
  try {
    const { requestId } = req.params

    const request = await MessageRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      })
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Only pending requests can be cancelled"
      })
    }

    request.status = "rejected"
    await request.save()

    emitNotificationRefresh([request.sender, request.receiver], {
      type: "message_request_cancelled",
      requestId: request._id.toString()
    })

    res.json({
      message: "Message request cancelled",
      request
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to cancel request" })
  }
}