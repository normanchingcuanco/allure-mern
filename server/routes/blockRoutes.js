import express from "express"
import {
  blockUser,
  unblockUser,
  getBlockedUsers
} from "../controllers/blockController.js"

const router = express.Router()

router.post("/", blockUser)

router.delete("/", unblockUser)

router.get("/:userId", getBlockedUsers)

export default router