import express from "express"
import { sendLike, getLikes, getReceivedLikes, getIncomingLikes } from "../controllers/likeController.js"
import { getIncomingLikesCount } from "../controllers/likeController.js"

const router = express.Router()

router.post("/", sendLike)
router.get("/", getLikes)
router.get("/received/:userId", getReceivedLikes)
router.get("/incoming/:userId", getIncomingLikes)
router.get("/incoming/count/:userId", getIncomingLikesCount)

export default router