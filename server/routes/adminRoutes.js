import express from "express"
import {
  getReports,
  suspendUser,
  deleteUser
} from "../controllers/adminController.js"

const router = express.Router()

router.get("/reports", getReports)

router.patch("/suspend/:userId", suspendUser)

router.delete("/delete/:userId", deleteUser)

export default router