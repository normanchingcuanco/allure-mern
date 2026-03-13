import User from "../models/User.js"
import Profile from "../models/Profile.js"
import Report from "../models/Report.js"

/* Get all reports */
export const getReports = async (req, res) => {
  try {

    const reports = await Report.find()
      .populate("reporterId", "email")
      .populate("reportedUserId", "email")

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