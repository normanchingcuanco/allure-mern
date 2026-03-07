import Block from "../models/Block.js"

export const blockUser = async (req, res) => {
  try {

    const { blockerId, blockedUserId } = req.body

    if (blockerId === blockedUserId) {
      return res.status(400).json({
        message: "You cannot block yourself"
      })
    }

    const existingBlock = await Block.findOne({
      blockerId,
      blockedUserId
    })

    if (existingBlock) {
      return res.status(400).json({
        message: "User already blocked"
      })
    }

    const block = new Block({
      blockerId,
      blockedUserId
    })

    await block.save()

    res.status(201).json({
      message: "User blocked successfully",
      block
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}


export const getBlockedUsers = async (req, res) => {
  try {

    const { userId } = req.params

    const blockedUsers = await Block.find({
      blockerId: userId
    }).populate("blockedUserId", "email")

    res.json(blockedUsers)

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}

export const unblockUser = async (req, res) => {
  try {

    const { blockId } = req.params
    const { userId } = req.body

    const block = await Block.findById(blockId)

    if (!block) {
      return res.status(404).json({
        message: "Block record not found"
      })
    }

    if (block.blockerId.toString() !== userId) {
      return res.status(403).json({
        message: "You are not allowed to remove this block"
      })
    }

    await Block.findByIdAndDelete(blockId)

    res.json({
      message: "User unblocked successfully"
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error
    })

  }
}