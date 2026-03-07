import Report from "../models/Report.js"

export const createReport = async (req, res) => {
  try {

    const { reporterId, reportedUserId, reason, description } = req.body

    if (reporterId === reportedUserId) {
      return res.status(400).json({ message: "You cannot report yourself" })
    }

    const report = new Report({
      reporterId,
      reportedUserId,
      reason,
      description
    })

    await report.save()

    res.status(201).json({
      message: "Report submitted",
      report
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}