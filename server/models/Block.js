import mongoose from "mongoose"

const blockSchema = new mongoose.Schema(
{
  blockerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  blockedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},
{
  timestamps: true
}
)

const Block = mongoose.model("Block", blockSchema)

export default Block