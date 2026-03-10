import { useState } from "react"

export default function ChatInput({ onSend }) {

  const [text, setText] = useState("")

  const handleSend = () => {

    if (!text.trim()) return

    onSend(text)

    setText("")
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "20px"
      }}
    >

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message"
        style={{
          flex: 1,
          padding: "10px"
        }}
      />

      <button onClick={handleSend}>
        Send
      </button>

    </div>
  )

}