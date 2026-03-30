import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import { createServer } from "http"
import { Server } from "socket.io"

import authRoutes from "./routes/authRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import likeRoutes from "./routes/likeRoutes.js"
import matchRoutes from "./routes/matchRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import favoriteRoutes from "./routes/favoriteRoutes.js"
import blockRoutes from "./routes/blockRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import messageRequestRoutes from "./routes/messageRequestRoutes.js"
import verificationRequestRoutes from "./routes/verificationRequestRoutes.js"

dotenv.config()

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
})

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/profiles", profileRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/matches", matchRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/favorites", favoriteRoutes)
app.use("/api/blocks", blockRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/message-requests", messageRequestRoutes)
app.use("/api/verification-requests", verificationRequestRoutes)

app.get("/", (req, res) => {
  res.send("Allure API running")
})

io.on("connection", (socket) => {

  socket.on("join_match", (matchId) => {
    socket.join(matchId)
  })

  socket.on("send_message", (data) => {
    io.to(data.matchId).emit("receive_message", data)
  })

  socket.on("typing", (data) => {
    socket.to(data.matchId).emit("user_typing", data)
  })

  socket.on("stop_typing", (data) => {
    socket.to(data.matchId).emit("user_stop_typing", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected")
  })

})

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected")

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => console.log(err))