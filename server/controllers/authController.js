import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"



export const registerUser = async (req, res) => {
  try {

    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const verificationToken = crypto.randomBytes(32).toString("hex")

    const newUser = new User({
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 3600000 // 1 hour
    })

    await newUser.save()

    res.status(201).json({
      message: "User registered successfully",
      verificationToken // temporary so frontend can test verification
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}



export const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in"
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    )

    res.json({
      token,
      userId: user._id
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}



export const verifyEmail = async (req, res) => {
  try {

    const { token } = req.params

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token"
      })
    }

    user.isEmailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined

    await user.save()

    res.json({
      message: "Email verified successfully"
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}