import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"

export const registerUser = async (req, res) => {
  try {

    const { email, password, gender } = req.body

    if (!email || !password || !gender) {
      return res.status(400).json({ message: "Email, password, and gender are required" })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const existingUser = await User.findOne({ email: normalizedEmail })

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const verificationToken = crypto.randomBytes(32).toString("hex")

    const newUser = new User({
      email: normalizedEmail,
      password: hashedPassword,
      gender,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 3600000
    })

    await newUser.save()

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
      verificationToken
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

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({ email: normalizedEmail })

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
      {
        id: user._id,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    )

    res.json({
      token,
      userId: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role
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

export const resendVerification = async (req, res) => {
  try {

    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" })
    }

    const newToken = crypto.randomBytes(32).toString("hex")

    user.emailVerificationToken = newToken
    user.emailVerificationExpires = Date.now() + 3600000

    await user.save()

    res.json({
      message: "Verification token regenerated",
      verificationToken: newToken
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}