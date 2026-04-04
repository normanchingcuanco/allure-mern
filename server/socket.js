import { Server } from "socket.io"

let ioInstance = null

export const initSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: "*"
    }
  })

  ioInstance.on("connection", (socket) => {
    socket.on("register_user", (userId) => {
      if (!userId) return
      socket.join(`user:${userId}`)
    })

    socket.on("join_match", (matchId) => {
      if (!matchId) return
      socket.join(`match:${matchId}`)
    })

    socket.on("leave_match", (matchId) => {
      if (!matchId) return
      socket.leave(`match:${matchId}`)
    })

    socket.on("send_message", (data) => {
      if (!data?.matchId) return
      socket.to(`match:${data.matchId}`).emit("receive_message", data)
    })

    socket.on("typing", (data) => {
      if (!data?.matchId) return
      socket.to(`match:${data.matchId}`).emit("user_typing", data)
    })

    socket.on("stop_typing", (data) => {
      if (!data?.matchId) return
      socket.to(`match:${data.matchId}`).emit("user_stop_typing", data)
    })

    socket.on("disconnect", () => {
      console.log("User disconnected")
    })
  })

  return ioInstance
}

export const getIo = () => ioInstance

export const emitToUser = (userId, eventName, payload = {}) => {
  if (!ioInstance || !userId || !eventName) return
  ioInstance.to(`user:${userId}`).emit(eventName, payload)
}

export const emitToUsers = (userIds = [], eventName, payload = {}) => {
  if (!ioInstance || !eventName) return

  const uniqueUserIds = [...new Set(userIds.map((id) => id?.toString()).filter(Boolean))]

  uniqueUserIds.forEach((userId) => {
    ioInstance.to(`user:${userId}`).emit(eventName, payload)
  })
}

export const emitToMatch = (matchId, eventName, payload = {}) => {
  if (!ioInstance || !matchId || !eventName) return
  ioInstance.to(`match:${matchId}`).emit(eventName, payload)
}