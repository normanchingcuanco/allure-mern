import express from "express"
import {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  discoverProfiles
} from "../controllers/profileController.js"

const router = express.Router()

router.post("/", createProfile)
router.get("/", getProfiles)
router.get("/:id", getProfileById)
router.patch("/:id", updateProfile)
router.get("/discover/:userId", discoverProfiles)

export default router