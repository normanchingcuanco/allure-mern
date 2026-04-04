import mongoose from "mongoose"

const reportSchema = new mongoose.Schema(
{
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  reason: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending"
  },

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  reviewedAt: {
    type: Date,
    default: null
  }

},
{
  timestamps: true
}
)

const Report = mongoose.model("Report", reportSchema)

export default Report