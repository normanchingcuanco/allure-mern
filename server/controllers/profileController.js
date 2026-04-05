// server/controllers/profileController.js
import Like from "../models/Like.js"
import Profile from "../models/Profile.js"
import User from "../models/User.js"
import Block from "../models/Block.js"

const MAX_PHOTOS = 6

const parseList = (value) => {
  if (!value) return []

  if (Array.isArray(value)) {
    return value
      .map(item => String(item).trim())
      .filter(Boolean)
  }

  return String(value)
    .split(",")
    .map(item => item.trim())
    .filter(Boolean)
}

const normalizePhotos = (photos) => {
  if (!photos) return []

  const cleaned = Array.isArray(photos)
    ? photos
        .map(photo => String(photo).trim())
        .filter(Boolean)
    : [String(photos).trim()].filter(Boolean)

  return [...new Set(cleaned)].slice(0, MAX_PHOTOS)
}

const buildProfilePayload = (body) => {
  const payload = {
    name: String(body.name || "").trim(),
    age: body.age === "" || body.age === undefined || body.age === null
      ? undefined
      : Number(body.age),
    bio: String(body.bio || "").trim(),
    interests: parseList(body.interests),
    lifestyle: String(body.lifestyle || "").trim(),
    relationshipGoals: String(body.relationshipGoals || "").trim(),
    photos: normalizePhotos(body.photos)
  }

  return payload
}

const validateProfilePayload = (payload, isCreate = true) => {
  if (isCreate && !payload.name) {
    return "Name is required"
  }

  if (payload.age !== undefined) {
    if (Number.isNaN(payload.age)) {
      return "Age must be a valid number"
    }

    if (payload.age < 18) {
      return "User must be at least 18 years old"
    }
  }

  if (payload.photos.length > MAX_PHOTOS) {
    return `You can upload up to ${MAX_PHOTOS} photos only`
  }

  return null
}

export const createProfile = async (req, res) => {
  try {
    const {
      userId,
      name,
      age,
      bio,
      interests,
      lifestyle,
      relationshipGoals,
      photos
    } = req.body

    const existingProfile = await Profile.findOne({ userId })

    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists" })
    }

    const payload = buildProfilePayload({
      name,
      age,
      bio,
      interests,
      lifestyle,
      relationshipGoals,
      photos
    })

    const validationError = validateProfilePayload(payload, true)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const profile = new Profile({
      userId,
      ...payload
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
    const profiles = await Profile.find().populate("userId", "email gender isSuspended")

    const filteredProfiles = profiles.filter(profile => {
      if (!profile.userId) return false
      return profile.userId.isSuspended !== true
    })

    res.json(filteredProfiles)
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
      .populate("userId", "email gender isSuspended")

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    if (!profile.userId || profile.userId.isSuspended) {
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
    const existingProfile = await Profile.findById(req.params.id)

    if (!existingProfile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    const payload = buildProfilePayload(req.body)
    const validationError = validateProfilePayload(payload, false)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    existingProfile.name = payload.name || existingProfile.name
    existingProfile.age = payload.age ?? existingProfile.age
    existingProfile.bio = payload.bio
    existingProfile.interests = payload.interests
    existingProfile.lifestyle = payload.lifestyle
    existingProfile.relationshipGoals = payload.relationshipGoals
    existingProfile.photos = payload.photos

    await existingProfile.save()

    res.json(existingProfile)
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

    if (currentUser.isSuspended) {
      return res.status(403).json({ message: "Your account has been suspended" })
    }

    if (currentUser.gender === "female") {
      const likes = await Like.find({ receiverId: userId })
        .populate({
          path: "senderId",
          select: "-password"
        })
        .sort({ createdAt: -1 })

      const filteredLikes = likes.filter(like => {
        if (!like.senderId) return false
        return like.senderId.isSuspended !== true
      })

      return res.json({
        mode: "incoming_likes",
        likes: filteredLikes
      })
    }

    const likes = await Like.find({ senderId: userId })
    const likedUserIds = likes.map(like => like.receiverId.toString())

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

    const suspendedUsers = await User.find({ isSuspended: true }).select("_id")
    const suspendedUserIds = suspendedUsers.map(user => user._id.toString())

    const excludedIds = [
      userId.toString(),
      ...likedUserIds,
      ...blockedUserIds,
      ...suspendedUserIds
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
      .populate("userId", "email gender isSuspended")
      .sort({ createdAt: -1 })

    const filteredProfiles = profiles.filter(profile => {
      if (!profile?.userId) return false
      if (profile.userId.isSuspended) return false
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
    const { viewerId } = req.query

    const profile = await Profile.findOne({ userId })
      .populate("userId", "email gender isSuspended")

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      })
    }

    if (!profile.userId || profile.userId.isSuspended) {
      return res.status(404).json({
        message: "Profile not found"
      })
    }

    if (
      viewerId &&
      viewerId.toString() !== userId.toString()
    ) {
      const block = await Block.findOne({
        $or: [
          {
            blockerId: viewerId,
            blockedId: userId
          },
          {
            blockerId: userId,
            blockedId: viewerId
          }
        ]
      })

      if (block) {
        return res.status(403).json({
          message: "You cannot view this profile"
        })
      }
    }

    res.json(profile)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Server error"
    })
  }
}