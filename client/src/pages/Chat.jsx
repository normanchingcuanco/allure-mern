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

        setMessages(res.data)

      } catch (err) {
        console.error(err)
      }

    }

    fetchMessages()

  }, [matchId])

  const sendMessage = async () => {

    try {

      await api.post("/messages", {
        matchId,
        senderId: userId,
        text
      })

      setMessages([...messages, { text }])
      setText("")

    } catch (err) {
      console.error(err)
    }

  }

  return (
    <div>

      <h1>Chat</h1>

      {messages.map((msg) => (

        <div key={msg._id || msg.text}>
          <p>{msg.text}</p>
        </div>

      ))}

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