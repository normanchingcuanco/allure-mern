import Like from "../models/Like.js"
import Profile from "../models/Profile.js"
import User from "../models/User.js"

export const createProfile = async (req, res) => {
  try {
    const { userId, name, age, bio, interests, lifestyle, relationshipGoals, photos } = req.body

    const existingProfile = await Profile.findOne({ userId })

    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists" })
    }

    const profile = new Profile({
      userId,
      name,
      age,
      bio,
      interests,
      lifestyle,
      relationshipGoals,
      photos
    })

    await profile.save()

    res.status(201).json({
      message: "Profile created successfully",
      profile
    })
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    })
  }
}

export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("userId", "email gender")

    res.json(profiles)
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    })
  }
}

export const getProfileById = async (req, res) => {
  try {

    const profile = await Profile.findById(req.params.id)
      .populate("userId", "email gender")

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    res.json({
      ...profile.toObject(),
      verified: profile.isVerified
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}

export const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedProfile)
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    })
  }
}

export const discoverProfiles = async (req, res) => {
  try {

    const { userId } = req.params
    const { minAge, maxAge, interests, lifestyle, relationshipGoals } = req.query

    const currentUser = await User.findById(userId)

    const likes = await Like.find({ senderId: userId })
    const likedUserIds = likes.map(like => like.receiverId)

    let targetGender = null

    if (currentUser.gender === "male") targetGender = "female"
    if (currentUser.gender === "female") targetGender = "male"

    let filter = {
      userId: {
        $ne: userId,
        $nin: likedUserIds
      }
    }

    if (minAge || maxAge) {
      filter.age = {}
      if (minAge) filter.age.$gte = Number(minAge)
      if (maxAge) filter.age.$lte = Number(maxAge)
    }

    if (interests) {
      filter.interests = { $in: interests.split(",") }
    }

    if (lifestyle) {
      filter.lifestyle = lifestyle
    }

    if (relationshipGoals) {
      filter.relationshipGoals = relationshipGoals
    }

    const profiles = await Profile.find(filter).populate("userId", "email gender")

    const filteredProfiles = profiles.filter(profile => {
      if (!profile.userId) return false
      if (!targetGender) return true
      return profile.userId.gender === targetGender
    })

    res.json(filteredProfiles)

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}

export const verifyProfile = async (req, res) => {
  try {

    const { id } = req.params

    const profile = await Profile.findById(id)

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    profile.isVerified = true
    await profile.save()

    res.json({
      message: "Profile verified successfully",
      profile
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}

export const deleteAccount = async (req, res) => {
  try {

    const { userId } = req.params

    const profile = await Profile.findOneAndDelete({ userId })
    const user = await User.findByIdAndDelete(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      message: "Account deleted successfully",
      user,
      profile
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}