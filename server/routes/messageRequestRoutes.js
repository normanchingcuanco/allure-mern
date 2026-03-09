import express from "express"
import {
  sendMessageRequest,
  getIncomingRequests,
  getOutgoingRequests,
  acceptMessageRequest,
  rejectMessageRequest
} from "../controllers/messageRequestController.js"

const router = express.Router()

router.post("/", sendMessageRequest)

router.get("/incoming/:userId", getIncomingRequests)

router.get("/outgoing/:userId", getOutgoingRequests)

router.patch("/accept/:requestId", acceptMessageRequest)

router.patch("/reject/:requestId", rejectMessageRequest)

export default router