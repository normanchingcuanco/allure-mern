import express from "express"
import {
  getMatches,
  unmatchUsers,
  getNewMatchesCount,
  clearNewMatches
} from "../controllers/matchController.js"

const router = express.Router()

router.get("/new-count/:userId", getNewMatchesCount)
router.get("/:userId", getMatches)

router.patch("/clear-new", clearNewMatches)

router.delete("/:matchId", unmatchUsers)

export default router