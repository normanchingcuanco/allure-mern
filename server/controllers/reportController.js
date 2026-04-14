import mongoose from "mongoose"
import Report from "../models/Report.js"
import User from "../models/User.js"

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value)

export const createReport = async (req, res) => {
  try {
    const { reporterId, reportedUserId, reason, description } = req.body

    if (!reporterId || !reportedUserId || !reason) {
      return res.status(400).json({
        message: "Reporter ID, reported user ID, and reason are required"
      })
    }

    if (!isValidObjectId(reporterId) || !isValidObjectId(reportedUserId)) {
      return res.status(400).json({
        message: "Invalid reporter ID or reported user ID"
      })
    }

    if (String(reporterId) === String(reportedUserId)) {
      return res.status(400).json({
        message: "You cannot report yourself"
      })
    }

    const reporter = await User.findById(reporterId)
    const reportedUser = await User.findById(reportedUserId)

    if (!reporter) {
      return res.status(404).json({
        message: "Reporter user not found"
      })
    }

    if (!reportedUser) {
      return res.status(404).json({
        message: "Reported user not found"
      })
    }

    const trimmedReason = String(reason).trim()
    const trimmedDescription = String(description || "").trim()

    if (!trimmedReason) {
      return res.status(400).json({
        message: "Reason is required"
      })
    }

    const report = new Report({
      reporterId,
      reportedUserId,
      reason: trimmedReason,
      description: trimmedDescription
    })

    await report.save()

    return res.status(201).json({
      message: "Report submitted",
      report
    })
  } catch (error) {
    console.error("createReport error:", error)

    return res.status(500).json({
      message: error?.message || "Server error"
    })
  }
}