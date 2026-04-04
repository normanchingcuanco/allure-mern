import { useEffect, useState, useCallback } from "react"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import socket from "../socket"

export default function BlockedUsers() {
  const userId = localStorage.getItem("userId")

  const [blockedUsers, setBlockedUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBlocked = useCallback(async () => {
    if (!userId) {
      setBlockedUsers([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      const res = await api.get(`/blocks/${userId}`)

      setBlockedUsers(res.data || [])
    } catch (err) {
      console.error("Fetch blocked users error:", err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const unblock = async (blockId) => {
    try {
      await api.delete(`/blocks/${blockId}`)

      setBlockedUsers((prev) =>
        prev.filter((b) => b._id !== blockId)
      )

      alert("User unblocked")
    } catch (err) {
      console.error("Unblock error:", err)
      alert("Failed to unblock user")
    }
  }

  useEffect(() => {
    fetchBlocked()
  }, [fetchBlocked])

  useEffect(() => {
    if (!userId) return

    socket.emit("register_user", userId)

    const handleRefresh = (payload) => {
      console.log("BlockedUsers refresh:", payload)

      if (!payload) return

      // refresh if current user is involved
      if (
        payload.blockerId === userId ||
        payload.blockedId === userId
      ) {
        fetchBlocked()
      }
    }

    socket.on("notifications_refresh", handleRefresh)

    return () => {
      socket.off("notifications_refresh", handleRefresh)
    }
  }, [userId, fetchBlocked])

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Blocked Users</h1>

        {loading && <p>Loading...</p>}

        {!loading && blockedUsers.length === 0 && (
          <p>No blocked users</p>
        )}

        {!loading && blockedUsers.map((block) => {
          const blockedUser =
            block.blocked ||
            block.blockedUser ||
            block.blockedId

          return (
            <div
              key={block._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px"
              }}
            >
              <p>
                {blockedUser?.email ||
                 blockedUser?.name ||
                 blockedUser ||
                 "Blocked user"}
              </p>

              <button onClick={() => unblock(block._id)}>
                Unblock
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}