import express from "express"
import { sendLike, getLikes } from "../controllers/likeController.js"

const router = express.Router()

router.post("/", sendLike)
router.get("/", getLikes)

export default router