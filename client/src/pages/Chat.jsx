import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

export default function Chat() {

  const { userId } = useAuth()
  const { matchId } = useParams()

  const [messages, setMessages] = useState([])
  const [receiverId, setReceiverId] = useState(null)
  const [text, setText] = useState("")

  useEffect(() => {

    const fetchMessages = async () => {
      try {

        const res = await api.get(`/messages/${matchId}`)
        setMessages(res.data || [])

      } catch (err) {
        console.error("Fetch messages error:", err)
      }
    }

    const fetchMatch = async () => {
      try {

        const res = await api.get(`/matches/${userId}`)

        const match = res.data.find(
          m => m._id.toString() === matchId
        )

        if (!match) return

        const otherUser = match.users.find(
          u => u._id.toString() !== userId
        )

        if (otherUser) {
          setReceiverId(otherUser._id)
        }

      } catch (err) {
        console.error("Fetch match error:", err)
      }
    }

    fetchMessages()
    fetchMatch()

    const interval = setInterval(fetchMessages, 3000)

    return () => clearInterval(interval)

  }, [matchId, userId])

  const sendMessage = async () => {

    if (!text.trim() || !receiverId) return

    try {

      const res = await api.post("/messages", {
        matchId,
        senderId: userId,
        receiverId,
        text
      })

      setMessages(prev => [...prev, res.data.data])

      setText("")

    } catch (err) {
      console.error("Send message error:", err)
    }

  }

  return (
    <div style={{ padding: "20px" }}>

      <h1>Chat</h1>

      <div style={{ marginBottom: "20px" }}>
        {messages.map((msg) => {

          const sender =
            typeof msg.senderId === "object"
              ? msg.senderId._id
              : msg.senderId

          const isMe = sender?.toString() === userId

          return (
            <div
              key={msg._id || msg.text}
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
              </div>

            </div>
          )
        })}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message"
          style={{ flex: 1, padding: "10px" }}
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>

    </div>
  )
}