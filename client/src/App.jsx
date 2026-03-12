import { useEffect, useState } from "react"
import socket from "./socket"
import { useNavigate } from "react-router-dom"

function App() {

  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {

    socket.on("receive_message", (data) => {

      setNotification({
        matchId: data.matchId,
        message: data.message
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)

    })

    return () => {
      socket.off("receive_message")
    }

  }, [])

  return (
    <>
      {notification && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#333",
            color: "#fff",
            padding: "15px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
          onClick={() => navigate(`/chat/${notification.matchId}`)}
        >
          💬 New message received
        </div>
      )}

      {/* existing routes */}
    </>
  )
}

export default App