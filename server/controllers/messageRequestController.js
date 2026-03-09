import MessageRequest from "../models/MessageRequest.js"

export const sendMessageRequest = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body

    const request = await MessageRequest.create({
      sender: senderId,
      receiver: receiverId,
      message
    })

    res.status(201).json(request)

  } catch (error) {
    console.error(error)
    res.status(500).json(error.message)
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

    const request = await MessageRequest.findByIdAndUpdate(
      requestId,
      { status: "accepted" },
      { new: true }
    )

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