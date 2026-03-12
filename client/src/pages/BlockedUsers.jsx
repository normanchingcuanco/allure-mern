import { useEffect, useState } from "react"
import api from "../api/axios"
import Navbar from "../components/Navbar"

export default function BlockedUsers() {

  const userId = localStorage.getItem("userId")

  const [blockedUsers, setBlockedUsers] = useState([])

  const fetchBlocked = async () => {
    try {

      const res = await api.get(`/blocks/${userId}`)

      setBlockedUsers(res.data || [])

    } catch (err) {
      console.error("Fetch blocked users error:", err)
    }
  }

  const unblock = async (blockId) => {
    try {

      await api.delete(`/blocks/${blockId}`)

      setBlockedUsers(prev =>
        prev.filter(b => b._id !== blockId)
      )

      alert("User unblocked")

    } catch (err) {
      console.error("Unblock error:", err)
      alert("Failed to unblock user")
    }
  }

  useEffect(() => {
    fetchBlocked()
  }, [])

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Blocked Users</h1>

        {blockedUsers.length === 0 && (
          <p>No blocked users</p>
        )}

        {blockedUsers.map((block) => {

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