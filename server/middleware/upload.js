// server/middleware/upload.js
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary.js"

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "allure_profiles",
    resource_type: "image",
    format: file.mimetype.split("/")[1]
  })
})

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ]

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, JPEG, PNG, and WEBP images are allowed"))
  }

  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

export default upload