import express from "express"
import {
  sendMessage,
  getMessages,
  markMessagesAsRead
} from "../controllers/messageController.js"

const router = express.Router()

router.post("/", sendMessage)

router.get("/:matchId", getMessages)

router.post("/read", markMessagesAsRead)

export default router