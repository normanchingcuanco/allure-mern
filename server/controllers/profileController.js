import Profile from "../models/Profile.js"

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

    const profiles = await Profile.find().populate("userId", "email")

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

    const profile = await Profile.findById(req.params.id).populate("userId", "email")

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    res.json(profile)

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