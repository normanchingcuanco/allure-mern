import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

export default function Chat() {

  const { userId } = useAuth()
  const { matchId } = useParams()

  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")

  useEffect(() => {

    const fetchMessages = async () => {

      try {

        const res = await api.get(`/messages/${matchId}`)
        setMessages(res.data || [])

      } catch (err) {
        console.error(err)
      }

    }

    fetchMessages()

    const interval = setInterval(fetchMessages, 3000)

    return () => clearInterval(interval)

  }, [matchId])

  const sendMessage = async () => {

    if (!text.trim()) return

    try {

      const receiverId =
        messages.length > 0
          ? (messages[0].senderId === userId
              ? messages[0].receiverId
              : messages[0].senderId)
          : null

      await api.post("/messages", {
        matchId,
        senderId: userId,
        receiverId,
        text
      })

      setMessages([...messages, { text, senderId: userId }])
      setText("")

    } catch (err) {
      console.error(err)
    }

  }

  return (
    <div>

      <h1>Chat</h1>

      {messages.map((msg) => {

        const isMe = msg.senderId === userId

        return (
          <div
            key={msg._id || msg.text}
            style={{
              display: "flex",
              justifyContent: isMe ? "flex-end" : "flex-start",
              margin: "10px"
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

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message"
      />

      <button onClick={sendMessage}>
        Send
      </button>

    </div>
  )
}