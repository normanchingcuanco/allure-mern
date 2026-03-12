import express from "express"
import {
  blockUser,
  unblockUser,
  getBlockedUsers
} from "../controllers/blockController.js"

const router = express.Router()

router.post("/", blockUser)

router.get("/:userId", getBlockedUsers)

router.delete("/:blockId", unblockUser)

export default router