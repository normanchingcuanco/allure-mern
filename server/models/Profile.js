import mongoose from "mongoose"

const profileSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  age: {
    type: Number
  },

  bio: {
    type: String
  },

  interests: {
    type: [String]
  },

  lifestyle: {
    type: String
  },

  relationshipGoals: {
    type: String
  },

  photos: {
    type: [String]
  },

  isVerified: {
    type: Boolean,
    default: false
  }

},
{
  timestamps: true
}
)

const Profile = mongoose.model("Profile", profileSchema)

export default Profile