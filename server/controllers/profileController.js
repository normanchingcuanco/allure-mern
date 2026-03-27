import Like from "../models/Like.js"
import Profile from "../models/Profile.js"
import User from "../models/User.js"
import Block from "../models/Block.js"

const parseList = (value) => {
  if (!value) return []
  return value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean)
}

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

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" })
    }

    /* Female users see incoming likes */
    if (currentUser.gender === "female") {
      const likes = await Like.find({ receiverId: userId })
        .populate({
          path: "senderId",
          select: "-password"
        })
        .sort({ createdAt: -1 })

      return res.json({
        mode: "incoming_likes",
        likes
      })
    }

    /* Male users browse profiles */
    const likes = await Like.find({ senderId: userId })
    const likedUserIds = likes.map(like => like.receiverId.toString())

    /* Get blocked users */
    const blocks = await Block.find({
      $or: [
        { blockerId: userId },
        { blockedId: userId }
      ]
    })

    const blockedUserIds = blocks.map(block =>
      block.blockerId.toString() === userId
        ? block.blockedId.toString()
        : block.blockerId.toString()
    )

    const excludedIds = [
      userId.toString(),
      ...likedUserIds,
      ...blockedUserIds
    ]

    const parsedMinAge = minAge ? Number(minAge) : null
    const parsedMaxAge = maxAge ? Number(maxAge) : null
    const parsedInterests = parseList(interests)
    const parsedLifestyle = parseList(lifestyle)
    const parsedRelationshipGoals = parseList(relationshipGoals)

    const filter = {
      userId: {
        $nin: excludedIds
      }
    }

    if (parsedMinAge !== null || parsedMaxAge !== null) {
      filter.age = {}

      if (parsedMinAge !== null && !Number.isNaN(parsedMinAge)) {
        filter.age.$gte = parsedMinAge
      }

      if (parsedMaxAge !== null && !Number.isNaN(parsedMaxAge)) {
        filter.age.$lte = parsedMaxAge
      }

      if (Object.keys(filter.age).length === 0) {
        delete filter.age
      }
    }

    if (parsedInterests.length > 0) {
      filter.interests = { $in: parsedInterests }
    }

    if (parsedLifestyle.length === 1) {
      filter.lifestyle = parsedLifestyle[0]
    }

    if (parsedLifestyle.length > 1) {
      filter.lifestyle = { $in: parsedLifestyle }
    }

    if (parsedRelationshipGoals.length === 1) {
      filter.relationshipGoals = parsedRelationshipGoals[0]
    }

    if (parsedRelationshipGoals.length > 1) {
      filter.relationshipGoals = { $in: parsedRelationshipGoals }
    }

    const profiles = await Profile.find(filter)
      .populate("userId", "email gender")
      .sort({ createdAt: -1 })

    const filteredProfiles = profiles.filter(profile => {
      if (!profile?.userId) return false
      return profile.userId.gender === "female"
    })

    res.json({
      mode: "browse",
      profiles: filteredProfiles
    })
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

export const getMyProfile = async (req, res) => {
  try {
    const { userId } = req.params

    const profile = await Profile.findOne({ userId })

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    res.json(profile)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}