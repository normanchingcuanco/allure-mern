import express from "express"
import { addFavorite, getFavorites } from "../controllers/favoriteController.js"

const router = express.Router()

router.post("/", addFavorite)

router.get("/:userId", getFavorites)

export default router