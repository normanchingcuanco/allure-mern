import { useEffect, useState, useRef, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import socket from "../socket"
import Navbar from "../components/Navbar"

const normalizeId = (value) => {
  if (!value) return ""
  if (typeof value === "object") {
    return value._id?.toString?.() || value.toString?.() || ""
  }
  return value.toString()
}

export default function Chat() {
  const auth = useAuth()
  const userId = auth?.userId || localStorage.getItem("userId")
  const { matchId } = useParams()
  const navigate = useNavigate()

  const [messages, setMessages] = useState([])
  const [receiverName, setReceiverName] = useState("")
  const [receiverPhoto, setReceiverPhoto] = useState("")
  const [text, setText] = useState("")
  const [typingUser, setTypingUser] = useState(false)
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)

  const bottomRef = useRef(null)

  const exitChat = useCallback(() => {
    setMessages([])
    setTypingUser(false)
    setText("")
    setError("")
    navigate("/matches", { replace: true })
  }, [navigate])

  const markCurrentMatchAsRead = useCallback(async () => {
    if (!matchId || !userId) return

    try {
      await api.patch("/messages/read", {
        matchId,
        userId
      })
    } catch (err) {
      console.error("Mark read error:", err)
    }
  }, [matchId, userId])

  const fetchMessages = useCallback(async () => {
    if (!userId || !matchId) return false

    try {
      setError("")

      const res = await api.get(`/messages/${matchId}`, {
        params: { userId }
      })

      setMessages(Array.isArray(res.data) ? res.data : [])
      return true
    } catch (err) {
      console.error("Fetch messages error:", err)

      // 🔥 FIX: if suspended → force logout
      if (err.response?.status === 403) {
        auth?.forceLogout?.()
        return false
      }

      if (err.response?.status === 404) {
        exitChat()
        return false
      }

      setError("Failed to load messages.")
      return false
    }
  }, [matchId, userId, exitChat, auth])

  const fetchMatch = useCallback(async () => {
    if (!userId || !matchId) return false

    try {
      const res = await api.get(`/matches/${userId}`)

      const match = Array.isArray(res.data)
        ? res.data.find((m) => m._id === matchId)
        : null

      if (!match) {
        exitChat()
        return false
      }

      if (match?.otherUser?._id) {
        try {
          const profileRes = await api.get(`/profiles/user/${match.otherUser._id}`)
          const profile = profileRes.data

          setReceiverName(profile?.name || "User")
          setReceiverPhoto(profile?.photos?.[0] || "")
        } catch (profileError) {
          console.error("Fetch receiver profile error:", profileError)
          setReceiverPhoto("")
          setReceiverName(match?.otherUser?.email || "User")
        }
      } else {
        setReceiverPhoto("")
        setReceiverName(match?.otherUser?.email || "User")
      }

      return true
    } catch (err) {
      console.error("Fetch match error:", err)

      // 🔥 FIX
      if (err.response?.status === 403) {
        auth?.forceLogout?.()
        return false
      }

      if (err.response?.status === 404) {
        exitChat()
        return false
      }

      setError("Failed to load chat.")
      return false
    }
  }, [userId, matchId, exitChat, auth])

  const refreshChatState = useCallback(async () => {
    const matchExists = await fetchMatch()

    if (!matchExists) {
      return
    }

    const messagesLoaded = await fetchMessages()

    if (!messagesLoaded) {
      return
    }

    await markCurrentMatchAsRead()
  }, [fetchMatch, fetchMessages, markCurrentMatchAsRead])

  useEffect(() => {
    if (!userId || !matchId) return

    refreshChatState()

    socket.emit("register_user", userId)
    socket.emit("join_match", matchId)

    return () => {
      socket.emit("leave_match", matchId)
    }
  }, [matchId, userId, refreshChatState])

  useEffect(() => {
    if (!matchId || !userId) return

    const handleReceiveMessage = async (data) => {
      if (data.matchId !== matchId) return

      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === data.message?._id)
        if (exists) return prev
        return [...prev, data.message]
      })

      const incomingSenderId = normalizeId(data.message?.senderId)

      if (incomingSenderId && incomingSenderId !== normalizeId(userId)) {
        await markCurrentMatchAsRead()
      }
    }

    const handleUserTyping = () => {
      setTypingUser(true)
    }

    const handleUserStopTyping = () => {
      setTypingUser(false)
    }

    const handleRefresh = async (data) => {
      // 🔥 FIX: socket suspension enforcement
      if (data?.type === "user_suspended" && data?.userId === userId) {
        auth?.forceLogout?.()
        return
      }

      await refreshChatState()
    }

    socket.on("receive_message", handleReceiveMessage)
    socket.on("user_typing", handleUserTyping)
    socket.on("user_stop_typing", handleUserStopTyping)
    socket.on("notifications_refresh", handleRefresh)

    return () => {
      socket.off("receive_message", handleReceiveMessage)
      socket.off("user_typing", handleUserTyping)
      socket.off("user_stop_typing", handleUserStopTyping)
      socket.off("notifications_refresh", handleRefresh)
    }
  }, [matchId, userId, markCurrentMatchAsRead, refreshChatState, auth])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!text.trim() || sending) return

    try {
      setSending(true)
      setError("")

      const trimmedText = text.trim()

      const res = await api.post("/messages", {
        matchId,
        senderId: userId,
        text: trimmedText
      })

      const message = res.data.data

      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === message?._id)
        if (exists) return prev
        return [...prev, message]
      })

      socket.emit("stop_typing", { matchId })
      setText("")
    } catch (err) {
      console.error("Send message error:", err)

      // 🔥 FIX
      if (err.response?.status === 403) {
        auth?.forceLogout?.()
        return
      }

      if (err.response?.status === 404) {
        exitChat()
        return
      }

      setError(err.response?.data?.message || "Failed to send message.")
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Chat</h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px"
          }}
        >
          {receiverPhoto && (
            <img
              src={receiverPhoto}
              alt={receiverName}
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          )}
          <h2>{receiverName}</h2>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            height: "400px",
            overflowY: "auto",
            marginBottom: "10px"
          }}
        >
          {messages.map((msg) => {
            const sender = normalizeId(msg.senderId)
            const isMe = sender === normalizeId(userId)

            return (
              <div
                key={msg._id}
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  margin: "10px 0"
                }}
              >
                <div
                  style={{
                    background: isMe ? "#DCF8C6" : "#eee",
                    padding: "10px",
                    borderRadius: "10px",
                    maxWidth: "60%"
                  }}
                >
                  <p style={{ margin: 0 }}>{msg.text}</p>

                  {msg.createdAt && (
                    <small style={{ fontSize: "10px" }}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </small>
                  )}
                </div>
              </div>
            )
          })}

          <div ref={bottomRef}></div>
        </div>

        {typingUser && (
          <p style={{ fontStyle: "italic", color: "#666" }}>
            {receiverName} is typing...
          </p>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={text}
            onChange={(e) => {
              const value = e.target.value
              setText(value)

              socket.emit("typing", { matchId })

              if (!value.trim()) {
                socket.emit("stop_typing", { matchId })
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && text.trim() && !sending) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Type message"
            style={{ flex: 1, padding: "10px" }}
          />

          <button onClick={sendMessage} disabled={sending}>
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </>
  )
}