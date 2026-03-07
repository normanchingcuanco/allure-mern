import express from "express"
import { sendLike, getLikes, getReceivedLikes } from "../controllers/likeController.js"

const router = express.Router()

router.post("/", sendLike)
router.get("/", getLikes)
router.get("/received/:userId", getReceivedLikes)

export default router