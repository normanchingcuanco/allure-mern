import VerificationRequest from "../models/VerificationRequest.js"
import Profile from "../models/Profile.js"
import User from "../models/User.js"

export const submitVerificationRequest = async (req, res) => {
  try {
    const { userId, idType, idImageUrl, selfieImageUrl } = req.body

    if (!userId || !idImageUrl || !selfieImageUrl) {
      return res.status(400).json({
        message: "userId, idImageUrl, and selfieImageUrl are required"
      })
    }

    const profile = await Profile.findOne({ userId })

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      })
    }

    if (profile.isVerified) {
      return res.status(400).json({
        message: "Profile is already verified"
      })
    }

    const existingPendingRequest = await VerificationRequest.findOne({
      userId,
      status: "pending"
    })

    if (existingPendingRequest) {
      return res.status(400).json({
        message: "You already have a pending verification request",
        verificationRequest: existingPendingRequest
      })
    }

    const verificationRequest = new VerificationRequest({
      userId,
      profileId: profile._id,
      idType,
      idImageUrl,
      selfieImageUrl
    })

    await verificationRequest.save()

    res.status(201).json({
      message: "Verification request submitted successfully",
      verificationRequest
    })
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    })
  }
}

export const getMyVerificationRequests = async (req, res) => {
  try {
    const { userId } = req.params

    const verificationRequests = await VerificationRequest.find({ userId })
      .sort({ createdAt: -1 })

    res.json(verificationRequests)
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    })
  }
}

export const getVerificationRequestById = async (req, res) => {
  try {
    const { id } = req.params

    const verificationRequest = await VerificationRequest.findById(id)
      .populate("userId", "email gender role isEmailVerified")
      .populate("profileId")

    if (!verificationRequest) {
      return res.status(404).json({
        message: "Verification request not found"
      })
    }

    res.json(verificationRequest)
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    })
  }
}

export const getPendingVerificationRequests = async (req, res) => {
  try {
    const verificationRequests = await VerificationRequest.find({
      status: "pending"
    })
      .populate("userId", "email gender role isEmailVerified")
      .populate("profileId")
      .sort({ createdAt: -1 })

    res.json(verificationRequests)
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    })
  }
}

// ✅ ADMIN PROTECTED
export const approveVerificationRequest = async (req, res) => {
  try {
    const { id } = req.params
    const { reviewedBy } = req.body

    const adminUser = await User.findById(reviewedBy)

    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({
        message: "Only admins can approve verification requests"
      })
    }

    const verificationRequest = await VerificationRequest.findById(id)

    if (!verificationRequest) {
      return res.status(404).json({
        message: "Verification request not found"
      })
    }

    if (verificationRequest.status !== "pending") {
      return res.status(400).json({
        message: `Verification request is already ${verificationRequest.status}`
      })
    }

    const profile = await Profile.findById(verificationRequest.profileId)

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      })
    }

    verificationRequest.status = "approved"
    verificationRequest.reviewedAt = new Date()
    verificationRequest.reviewedBy = reviewedBy
    verificationRequest.rejectionReason = ""

    await verificationRequest.save()

    profile.isVerified = true
    await profile.save()

    res.json({
      message: "Verification request approved successfully",
      verificationRequest,
      profile
    })
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    })
  }
}

// ✅ ADMIN PROTECTED
export const rejectVerificationRequest = async (req, res) => {
  try {
    const { id } = req.params
    const { reviewedBy, rejectionReason } = req.body

    const adminUser = await User.findById(reviewedBy)

    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({
        message: "Only admins can reject verification requests"
      })
    }

    const verificationRequest = await VerificationRequest.findById(id)

    if (!verificationRequest) {
      return res.status(404).json({
        message: "Verification request not found"
      })
    }

    if (verificationRequest.status !== "pending") {
      return res.status(400).json({
        message: `Verification request is already ${verificationRequest.status}`
      })
    }

    verificationRequest.status = "rejected"
    verificationRequest.reviewedAt = new Date()
    verificationRequest.reviewedBy = reviewedBy
    verificationRequest.rejectionReason = rejectionReason || "Rejected"

    await verificationRequest.save()

    res.json({
      message: "Verification request rejected successfully",
      verificationRequest
    })
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    })
  }
}