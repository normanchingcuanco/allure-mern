import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../api/axios"

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireProfile = false,
  guestOnly = false
}) {
  const { userId, isAdmin } = useAuth()
  const location = useLocation()
  const token = localStorage.getItem("token")

  const [checkingProfile, setCheckingProfile] = useState(requireProfile)
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    let isMounted = true

    const checkProfile = async () => {
      if (guestOnly || !requireProfile) {
        if (isMounted) {
          setCheckingProfile(false)
          setHasProfile(false)
        }
        return
      }

      if (!userId || !token) {
        if (isMounted) {
          setCheckingProfile(false)
          setHasProfile(false)
        }
        return
      }

      if (isAdmin === true || isAdmin === "true") {
        if (isMounted) {
          setHasProfile(true)
          setCheckingProfile(false)
        }
        return
      }

      if (isMounted) {
        setCheckingProfile(true)
      }

      try {
        await api.get(`/profiles/user/${userId}`)

        if (isMounted) {
          setHasProfile(true)
        }
      } catch (error) {
        if (error.response?.status === 404) {
          if (isMounted) {
            setHasProfile(false)
          }
        } else if (error.response?.status === 403) {
          if (isMounted) {
            setHasProfile(true)
          }
        } else {
          console.error("ProtectedRoute profile check error:", error)
          if (isMounted) {
            setHasProfile(false)
          }
        }
      } finally {
        if (isMounted) {
          setCheckingProfile(false)
        }
      }
    }

    checkProfile()

    return () => {
      isMounted = false
    }
  }, [guestOnly, requireProfile, userId, token, isAdmin])

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

  if (requireAuth && requireProfile && !hasProfile) {
    return <Navigate to="/create-profile" replace />
  }

  return children
}