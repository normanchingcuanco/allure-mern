import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"

export default function AdminReports() {
  const navigate = useNavigate()

  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingKey, setProcessingKey] = useState("")

  const isAdmin = localStorage.getItem("isAdmin") === "true"
  const adminUserId = localStorage.getItem("userId")

  useEffect(() => {
    if (!isAdmin) {
      alert("Unauthorized access")
      navigate("/discover")
      return
    }

    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)

      const res = await api.get("/admin/reports")
      setReports(res.data || [])
    } catch (error) {
      console.error(error)
      alert("Failed to load reports")
    } finally {
      setLoading(false)
    }
  }

  const handleSuspendUser = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to suspend this user?")
    if (!confirmed) return

    try {
      setProcessingKey(`suspend-${userId}`)

      await api.patch(`/admin/suspend/${userId}`)

      alert("User suspended")
      fetchReports()
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || "Failed to suspend user")
    } finally {
      setProcessingKey("")
    }
  }

  const handleUnsuspendUser = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to unsuspend this user?")
    if (!confirmed) return

    try {
      setProcessingKey(`unsuspend-${userId}`)

      await api.patch(`/admin/unsuspend/${userId}`)

      alert("User unsuspended")
      fetchReports()
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || "Failed to unsuspend user")
    } finally {
      setProcessingKey("")
    }
  }

  const handleResolveReport = async (reportId) => {
    const confirmed = window.confirm("Mark this report as resolved?")
    if (!confirmed) return

    try {
      setProcessingKey(`resolve-${reportId}`)

      await api.patch(`/admin/reports/${reportId}/resolve`, {
        adminUserId
      })

      alert("Report resolved")
      fetchReports()
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || "Failed to resolve report")
    } finally {
      setProcessingKey("")
    }
  }

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to permanently delete this user?")
    if (!confirmed) return

    try {
      setProcessingKey(`delete-${userId}`)

      await api.delete(`/admin/delete/${userId}`)

      alert("User deleted")
      fetchReports()
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || "Failed to delete user")
    } finally {
      setProcessingKey("")
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <p>Loading reports...</p>
      </>
    )
  }

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h2>Admin Reports</h2>

        {reports.length === 0 ? (
          <p>No reports found</p>
        ) : (
          reports.map((report) => {
            const reportedUserId = report.reportedUserId?._id
            const reporterEmail = report.reporterId?.email || "Unknown"
            const reportedEmail = report.reportedUserId?.email || "Unknown"
            const isSuspended = report.reportedUserId?.isSuspended === true
            const isResolved = report.status === "resolved"
            const createdAt = report.createdAt
              ? new Date(report.createdAt).toLocaleString()
              : "—"
            const reviewedAt = report.reviewedAt
              ? new Date(report.reviewedAt).toLocaleString()
              : "—"
            const reviewedBy = report.reviewedBy?.email || "—"

            return (
              <div
                key={report._id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "16px"
                }}
              >
                <p><strong>Reporter:</strong> {reporterEmail}</p>
                <p><strong>Reported User:</strong> {reportedEmail}</p>
                <p><strong>User Status:</strong> {isSuspended ? "Suspended" : "Active"}</p>
                <p><strong>Report Status:</strong> {isResolved ? "Resolved" : "Pending"}</p>
                <p><strong>Reason:</strong> {report.reason}</p>
                <p><strong>Description:</strong> {report.description || "—"}</p>
                <p><strong>Submitted:</strong> {createdAt}</p>
                <p><strong>Reviewed By:</strong> {reviewedBy}</p>
                <p><strong>Reviewed At:</strong> {reviewedAt}</p>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                  {isSuspended ? (
                    <button
                      onClick={() => handleUnsuspendUser(reportedUserId)}
                      disabled={!reportedUserId || processingKey === `unsuspend-${reportedUserId}`}
                      style={{
                        background: "#2e7d32",
                        color: "white",
                        border: "none",
                        padding: "10px 14px",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      {processingKey === `unsuspend-${reportedUserId}` ? "Unsuspending..." : "Unsuspend User"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSuspendUser(reportedUserId)}
                      disabled={!reportedUserId || processingKey === `suspend-${reportedUserId}`}
                      style={{
                        background: "#b8860b",
                        color: "white",
                        border: "none",
                        padding: "10px 14px",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      {processingKey === `suspend-${reportedUserId}` ? "Suspending..." : "Suspend User"}
                    </button>
                  )}

                  <button
                    onClick={() => handleResolveReport(report._id)}
                    disabled={isResolved || processingKey === `resolve-${report._id}`}
                    style={{
                      background: "#1565c0",
                      color: "white",
                      border: "none",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    {processingKey === `resolve-${report._id}` ? "Resolving..." : isResolved ? "Resolved" : "Mark Resolved"}
                  </button>

                  <button
                    onClick={() => handleDeleteUser(reportedUserId)}
                    disabled={!reportedUserId || processingKey === `delete-${reportedUserId}`}
                    style={{
                      background: "#c62828",
                      color: "white",
                      border: "none",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    {processingKey === `delete-${reportedUserId}` ? "Deleting..." : "Delete User"}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}