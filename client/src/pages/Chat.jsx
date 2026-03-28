import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import socket from "../socket"

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

  const markCurrentMatchAsRead = async () => {
    if (!matchId || !userId) return

    try {
      await api.patch("/messages/read", {
        matchId,
        userId
      })
    } catch (err) {
      console.error("Mark read error:", err)
    }
  }

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setError("")

        const res = await api.get(`/messages/${matchId}`, {
          params: { userId }
        })

        setMessages(Array.isArray(res.data) ? res.data : [])

        await markCurrentMatchAsRead()
      } catch (err) {
        console.error("Fetch messages error:", err)

        if (err.response?.status === 403) {
          setError("You are not authorized to view this chat.")
          setMessages([])
          return
        }

        if (err.response?.status === 404) {
          setError("Chat not found.")
          setMessages([])
          return
        }

        setError("Failed to load messages.")
      }
    }

    const fetchMatch = async () => {
      try {
        const res = await api.get(`/matches/${userId}`)

        const match = Array.isArray(res.data)
          ? res.data.find((m) => m.matchId === matchId)
          : null

        if (!match) return

        setReceiverName(match.name || "")
        setReceiverPhoto(match.photo || "")
      } catch (err) {
        console.error("Fetch match error:", err)
      }
    }

    if (!userId || !matchId) return

    fetchMessages()
    fetchMatch()

    if (socket) {
      socket.emit("join_match", matchId)
    }
  }, [matchId, userId])

  useEffect(() => {
    if (!socket || !matchId || !userId) return

    const handleReceiveMessage = async (data) => {
      if (data.matchId !== matchId) return

      setMessages((prev) => [...prev, data.message])

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

    socket.on("receive_message", handleReceiveMessage)
    socket.on("user_typing", handleUserTyping)
    socket.on("user_stop_typing", handleUserStopTyping)

    return () => {
      socket.off("receive_message", handleReceiveMessage)
      socket.off("user_typing", handleUserTyping)
      socket.off("user_stop_typing", handleUserStopTyping)
    }
  }, [matchId, userId])

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

      setMessages((prev) => [...prev, message])

      if (socket) {
        socket.emit("send_message", {
          matchId,
          message
        })

        socket.emit("stop_typing", { matchId })
      }

      setText("")
    } catch (err) {
      console.error("Send message error:", err)

      if (err.response?.status === 403) {
        setError("You are not authorized to send messages in this chat.")
        return
      }

      if (err.response?.status === 404) {
        setError("Chat not found.")
        return
      }

      setError(err.response?.data?.message || "Failed to send message.")
    } finally {
      setSending(false)
    }
  }

  if (error && messages.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Chat</h1>
        <p>{error}</p>
        <button onClick={() => navigate("/matches")}>
          Back to Matches
        </button>
      </div>
    )
  }

  return (
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

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

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
              key={msg._id || `${msg.text}-${msg.createdAt}`}
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

            if (socket) {
              socket.emit("typing", { matchId })

              if (!value.trim()) {
                socket.emit("stop_typing", { matchId })
              }
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
  )
}