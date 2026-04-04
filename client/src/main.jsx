import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import socket from "./socket"
import { AuthProvider } from "./context/AuthContext"

const userId = localStorage.getItem("userId")

if (userId) {
  console.log("GLOBAL socket register:", userId)
  socket.emit("register_user", userId)
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)