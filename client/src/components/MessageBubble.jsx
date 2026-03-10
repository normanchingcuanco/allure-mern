export default function MessageBubble({ message, isMe }) {

  return (
    <div
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
        <p style={{ margin: 0 }}>{message.text}</p>
      </div>

    </div>
  )

}