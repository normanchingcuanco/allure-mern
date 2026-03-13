import express from "express"
import {
  sendMessageRequest,
  getIncomingRequests,
  acceptMessageRequest,
  rejectMessageRequest,
  getOutgoingRequests
} from "../controllers/messageRequestController.js"

const router = express.Router()

router.post("/", sendMessageRequest)

router.get("/incoming/:userId", getIncomingRequests)

router.get("/outgoing/:userId", getOutgoingRequests)

router.patch("/:requestId/accept", acceptMessageRequest)

router.patch("/:requestId/reject", rejectMessageRequest)

export default router