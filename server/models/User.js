import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
{
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    gender: {
        type: String
    },

    country: {
        type: String
    },

    role: {
        type: String,
        default: "user"
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: {
        type: String
    },

    isSuspended: {
        type: Boolean,
        default: false
    }

},
{
    timestamps: true
}
)

const User = mongoose.model("User", userSchema)

export default User