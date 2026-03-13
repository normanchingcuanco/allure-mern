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

/* ================================
   PROFILE DISCOVERY
================================ */

router.get("/discover/:userId", discoverProfiles)

/* ================================
   PROFILE ROUTES
================================ */

router.post("/", createProfile)
router.get("/", getProfiles)
router.get("/user/:userId", getMyProfile)
router.get("/discover/:userId", discoverProfiles)

/* ================================
   PROFILE MANAGEMENT
================================ */

router.patch("/:id", updateProfile)
router.get("/:id", getProfileById)

/* ================================
   PROFILE VERIFICATION
================================ */

router.patch("/verify/:id", verifyProfile)

/* ================================
   DELETE ACCOUNT
================================ */

router.delete("/account/:userId", deleteAccount)

export default router