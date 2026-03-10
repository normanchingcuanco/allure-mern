import express from "express"
import { sendMessage, getMessages } from "../controllers/messageController.js"

const router = express.Router()

/* Send message */
router.post("/", sendMessage)

/* Get conversation */
router.get("/:matchId", getMessages)

export default router