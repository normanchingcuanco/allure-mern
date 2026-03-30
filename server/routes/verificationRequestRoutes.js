import express from "express"
import {
  submitVerificationRequest,
  getMyVerificationRequests,
  getVerificationRequestById,
  getPendingVerificationRequests,
  approveVerificationRequest,
  rejectVerificationRequest
} from "../controllers/verificationRequestController.js"

const router = express.Router()

router.post("/", submitVerificationRequest)

router.get("/mine/:userId", getMyVerificationRequests)
router.get("/pending", getPendingVerificationRequests)
router.get("/:id", getVerificationRequestById)

router.patch("/approve/:id", approveVerificationRequest)
router.patch("/reject/:id", rejectVerificationRequest)

export default router