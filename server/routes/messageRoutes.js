import express from "express"
import {
  sendMessage,
  getMessages,
  deleteMessage,
  markMessagesAsRead,
  getUnreadCount
} from "../controllers/messageController.js"

const router = express.Router()

router.post("/", sendMessage)

router.get("/unread-count/:userId", getUnreadCount)
router.get("/:matchId", getMessages)

router.delete("/:messageId", deleteMessage)

router.patch("/read", markMessagesAsRead)

export default router