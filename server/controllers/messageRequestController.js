import MessageRequest from "../models/MessageRequest.js"
import Match from "../models/Match.js"
import Block from "../models/Block.js"

export const sendMessageRequest = async (req, res) => {
  try {

    const { senderId, receiverId, message } = req.body

    if (senderId === receiverId) {
      return res.status(400).json({
        message: "You cannot message yourself"
      })
    }

    const blocked = await Block.findOne({
      $or: [
        { blocker: senderId, blocked: receiverId },
        { blocker: receiverId, blocked: senderId }
      ]
    })

    if (blocked) {
      return res.status(403).json({
        message: "You cannot message this user"
      })
    }

    const existingRequest = await MessageRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending"
    })

    if (existingRequest) {
      return res.status(400).json({
        message: "Message request already sent"
      })
    }

    const request = await MessageRequest.create({
      sender: senderId,
      receiver: receiverId,
      message
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
      receiver: userId,
      status: "pending"
    }).populate("sender", "email")

    res.json(requests)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch requests" })
  }
}

export const acceptMessageRequest = async (req, res) => {
  try {

    const { requestId } = req.params

    const request = await MessageRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    request.status = "accepted"
    await request.save()

    const existingMatch = await Match.findOne({
      users: { $all: [request.sender, request.receiver] }
    })

    if (!existingMatch) {

      await Match.create({
        users: [request.sender, request.receiver]
      })

    }

    res.json(request)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to accept request" })
  }
}

export const rejectMessageRequest = async (req, res) => {
  try {

    const { requestId } = req.params

    const request = await MessageRequest.findByIdAndUpdate(
      requestId,
      { status: "rejected" },
      { new: true }
    )

    res.json(request)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to reject request" })
  }
}

export const getOutgoingRequests = async (req, res) => {
  try {

    const { userId } = req.params

    const requests = await MessageRequest.find({
      sender: userId,
      status: "pending"
    }).populate("receiver", "email")

    res.json(requests)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch outgoing requests" })
  }
}