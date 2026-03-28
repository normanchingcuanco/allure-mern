import express from "express"
import {
  sendMessage,
  getMessages,
  deleteMessage,
  markMessagesAsRead
} from "../controllers/messageController.js"

const router = express.Router()

router.post("/", sendMessage)

router.get("/:matchId", getMessages)

router.delete("/:messageId", deleteMessage)

router.patch("/read", markMessagesAsRead)

export default router