import express from "express"
import {
  sendMessageRequest,
  getIncomingRequests,
  acceptMessageRequest,
  rejectMessageRequest,
  getOutgoingRequests,
  getIncomingRequestsCount,
  cancelMessageRequest
} from "../controllers/messageRequestController.js"

const router = express.Router()

router.post("/", sendMessageRequest)

router.get("/incoming/:userId", getIncomingRequests)
router.get("/outgoing/:userId", getOutgoingRequests)
router.get("/count/:userId", getIncomingRequestsCount)

router.patch("/:requestId/accept", acceptMessageRequest)
router.patch("/:requestId/reject", rejectMessageRequest)
router.patch("/:requestId/cancel", cancelMessageRequest)

export default router