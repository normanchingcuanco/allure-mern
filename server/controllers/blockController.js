import Block from "../models/Block.js"

export const blockUser = async (req, res) => {
  try {

    const { blockerId, blockedId } = req.body

    if (blockerId === blockedId) {
      return res.status(400).json({
        message: "You cannot block yourself"
      })
    }

    const existingBlock = await Block.findOne({
      blockerId,
      blockedId
    })

    if (existingBlock) {
      return res.status(400).json({
        message: "User already blocked"
      })
    }

    const block = new Block({
      blockerId,
      blockedId
    })

    await block.save()

    res.status(201).json({
      message: "User blocked successfully",
      block
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Server error"
    })

  }
}


export const getBlockedUsers = async (req, res) => {
  try {

    const { userId } = req.params

    const blockedUsers = await Block.find({
      blockerId: userId
    }).populate("blockedId", "email")

    res.json(blockedUsers)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Server error"
    })

  }
}


export const unblockUser = async (req, res) => {
  try {

    const { blockId } = req.params

    const block = await Block.findByIdAndDelete(blockId)

    if (!block) {
      return res.status(404).json({
        message: "Block record not found"
      })
    }

    res.json({
      message: "User unblocked successfully"
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Server error"
    })

  }
}