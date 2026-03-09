import express from "express"
import {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  discoverProfiles,
  verifyProfile,
  deleteAccount,
  getMyProfile
} from "../controllers/profileController.js"

const router = express.Router()

router.post("/", createProfile)
router.get("/", getProfiles)
router.get("/:id", getProfileById)
router.patch("/:id", updateProfile)
router.get("/user/:userId", getMyProfile)
router.get("/discover/:userId", discoverProfiles)

/* Profile Verification */
router.patch("/verify/:id", verifyProfile)

/* Delete Account */
router.delete("/account/:userId", deleteAccount)

export default router