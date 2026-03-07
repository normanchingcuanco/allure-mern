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
  }

},
{
  timestamps: true
}
)

const Report = mongoose.model("Report", reportSchema)

export default Report