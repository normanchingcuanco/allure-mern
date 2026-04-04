import express from "express"
import {
  getReports,
  suspendUser,
  unsuspendUser,
  resolveReport,
  deleteUser
} from "../controllers/adminController.js"

const router = express.Router()

router.get("/reports", getReports)

router.patch("/suspend/:userId", suspendUser)
router.patch("/unsuspend/:userId", unsuspendUser)
router.patch("/reports/:reportId/resolve", resolveReport)

router.delete("/delete/:userId", deleteUser)

export default router