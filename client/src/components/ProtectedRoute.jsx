import { useEffect, useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../api/axios"

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireProfile = false,
  guestOnly = false
}) {
  const auth = useAuth()
  const userId = auth?.userId || localStorage.getItem("userId")
  const isAdmin = auth?.isAdmin ?? localStorage.getItem("isAdmin")
  const logout = auth?.logout
  const location = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [checkingProfile, setCheckingProfile] = useState(false)
  const [hasProfile, setHasProfile] = useState(null)
  const [forceLogout, setForceLogout] = useState(false)

  useEffect(() => {
    let cancelled = false

    const handleSuspendedSession = () => {
      if (cancelled) return

      if (typeof logout === "function") {
        logout()
      } else {
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        localStorage.removeItem("isAdmin")
      }

      setForceLogout(true)
    }

    const checkProfile = async () => {
      if (!requireProfile || guestOnly) {
        if (!cancelled) {
          setCheckingProfile(false)
          setHasProfile(null)
        }
        return
      }

      if (!userId || !token) {
        if (!cancelled) {
          setCheckingProfile(false)
          setHasProfile(false)
        }
        return
      }

      if (isAdmin === true || isAdmin === "true") {
        if (!cancelled) {
          setCheckingProfile(false)
          setHasProfile(true)
        }
        return
      }

      if (!cancelled) {
        setCheckingProfile(true)
      }

      try {
        const res = await api.get(`/profiles/user/${userId}`, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache"
          }
        })

        if (!cancelled) {
          setHasProfile(res.status >= 200 && res.status < 300)
        }
      } catch (error) {
        if (cancelled) return

        if (error.response?.status === 404) {
          setHasProfile(false)
        } else if (error.response?.status === 403) {
          const message = error.response?.data?.message || ""

          if (
            message.toLowerCase().includes("suspended") ||
            message.toLowerCase().includes("account is suspended")
          ) {
            handleSuspendedSession()
            return
          }

          setHasProfile(false)
        } else {
          console.error("ProtectedRoute profile check error:", error)
          setHasProfile(false)
        }
      } finally {
        if (!cancelled) {
          setCheckingProfile(false)
        }
      }
    }

    checkProfile()

    return () => {
      cancelled = true
    }
  }, [guestOnly, requireProfile, userId, token, isAdmin, logout])

  useEffect(() => {
    if (!forceLogout) return

    navigate("/login", {
      replace: true,
      state: {
        suspended: true,
        message: "Your account is suspended."
      }
    })
  }, [forceLogout, navigate])

  if (forceLogout) {
    return null
  }

  if (guestOnly) {
    if (userId && token) {
      return <Navigate to="/discover" replace />
    }

    return children
  }

  if (requireAuth && (!userId || !token)) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireProfile && checkingProfile) {
    return <p>Loading...</p>
  }

  if (requireAuth && requireProfile && hasProfile === false) {
    return <Navigate to="/create-profile" replace />
  }

  if (requireAuth && requireProfile && hasProfile === null) {
    return <p>Loading...</p>
  }

  return children
}