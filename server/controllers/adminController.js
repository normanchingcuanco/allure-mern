import User from "../models/User.js"
import Profile from "../models/Profile.js"
import Report from "../models/Report.js"

/* Get all reports */
export const getReports = async (req, res) => {
  try {

    const reports = await Report.find()
      .populate("reporterId", "email")
      .populate("reportedUserId", "email isSuspended")
      .populate("reviewedBy", "email")
      .sort({ createdAt: -1 })

    res.json(reports)

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}


/* Suspend user */
export const suspendUser = async (req, res) => {
  try {

    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.isSuspended = true
    await user.save()

    res.json({
      message: "User suspended",
      user
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}


/* Unsuspend user */
export const unsuspendUser = async (req, res) => {
  try {

    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.isSuspended = false
    await user.save()

    res.json({
      message: "User unsuspended",
      user
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}


/* Mark report as resolved */
export const resolveReport = async (req, res) => {
  try {

    const { reportId } = req.params
    const { adminUserId } = req.body

    const report = await Report.findById(reportId)

    if (!report) {
      return res.status(404).json({ message: "Report not found" })
    }

    report.status = "resolved"
    report.reviewedBy = adminUserId || null
    report.reviewedAt = new Date()

    await report.save()

    const updatedReport = await Report.findById(report._id)
      .populate("reporterId", "email")
      .populate("reportedUserId", "email isSuspended")
      .populate("reviewedBy", "email")

    res.json({
      message: "Report resolved",
      report: updatedReport
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}


/* Delete user */
export const deleteUser = async (req, res) => {
  try {

    const { userId } = req.params

    const profile = await Profile.findOneAndDelete({ userId })
    const user = await User.findByIdAndDelete(userId)

    res.json({
      message: "User deleted",
      user,
      profile
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}