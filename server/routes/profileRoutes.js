// server/routes/profileRoutes.js
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
import upload from "../middleware/upload.js"

const router = express.Router()

/* ================================
   PROFILE DISCOVERY
================================ */

router.get("/discover/:userId", discoverProfiles)

/* ================================
   PROFILE UPLOAD
================================ */

router.post("/upload", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: err.message || "Upload failed"
      })
    }

    next()
  })
}, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" })
    }

    res.json({
      imageUrl: req.file.path
    })
  } catch (error) {
    res.status(500).json({
      message: "Upload failed",
      error
    })
  }
})

/* ================================
   PROFILE ROUTES
================================ */

router.post("/", createProfile)
router.get("/", getProfiles)
router.get("/user/:userId", getMyProfile)

/* ================================
   PROFILE MANAGEMENT
================================ */

router.put("/:id", updateProfile)
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