import mongoose from "mongoose"

const likeSchema = new mongoose.Schema(
{
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

},
{
  timestamps: true
}
)

const Like = mongoose.model("Like", likeSchema)

export default Like