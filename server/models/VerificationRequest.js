import mongoose from "mongoose"

const verificationRequestSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true
  },

  idType: {
    type: String,
    enum: ["passport", "drivers_license", "national_id", "other"],
    default: "other"
  },

  idImageUrl: {
    type: String,
    required: true
  },

  selfieImageUrl: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  submittedAt: {
    type: Date,
    default: Date.now
  },

  reviewedAt: {
    type: Date,
    default: null
  },

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  rejectionReason: {
    type: String,
    default: ""
  }

},
{
  timestamps: true
}
)

const VerificationRequest = mongoose.model("VerificationRequest", verificationRequestSchema)

export default VerificationRequest