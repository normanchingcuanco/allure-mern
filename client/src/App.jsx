import { Routes, Route } from "react-router-dom"

import ProtectedRoute from "./components/ProtectedRoute"

import Login from "./pages/Login"
import Register from "./pages/Register"
import VerifyEmail from "./pages/VerifyEmail"
import Discover from "./pages/Discover"
import CreateProfile from "./pages/CreateProfile"
import EditProfile from "./pages/EditProfile"
import Profile from "./pages/Profile"
import Favorites from "./pages/Favorites"
import Likes from "./pages/Likes"
import IncomingLikes from "./pages/IncomingLikes"
import Matches from "./pages/Matches"
import Chat from "./pages/Chat"
import MessageRequests from "./pages/MessageRequests"
import BlockedUsers from "./pages/BlockedUsers"
import VerificationRequest from "./pages/VerificationRequest"
import AdminVerification from "./pages/AdminVerification"
import AdminReports from "./pages/AdminReports"
import AccountSettings from "./pages/AccountSettings"

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute guestOnly>
            <Login />
          </ProtectedRoute>
        }
      />

      <Route
        path="/login"
        element={
          <ProtectedRoute guestOnly>
            <Login />
          </ProtectedRoute>
        }
      />

      <Route
        path="/register"
        element={
          <ProtectedRoute guestOnly>
            <Register />
          </ProtectedRoute>
        }
      />

      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      <Route
        path="/discover"
        element={
          <ProtectedRoute requireAuth requireProfile>
            <Discover />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-profile"
        element={
          <ProtectedRoute requireAuth>
            <CreateProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute requireAuth requireProfile>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute requireAuth requireProfile>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/favorites"
        element={
          <ProtectedRoute requireAuth requireProfile>
            <Favorites />
          </ProtectedRoute>
        }
      />

      <Route
        path="/likes"
        element={
          <ProtectedRoute requireAuth requireProfile>
            <Likes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/incoming-likes"
        element={
          <ProtectedRoute requireAuth requireProfile>
            <IncomingLikes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/matches"
        element={
          <ProtectedRoute requireAuth requireProfile>
            <Matches />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:matchId"
        element={
          <ProtectedRoute requireAuth requireProfile>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/message-requests"
        element={
          <ProtectedRoute requireAuth requireProfile>
            <MessageRequests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/blocked-users"
        element={
          <ProtectedRoute requireAuth requireProfile>
            <BlockedUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/verification-request"
        element={
          <ProtectedRoute requireAuth requireProfile>
            <VerificationRequest />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/verification"
        element={
          <ProtectedRoute requireAuth>
            <AdminVerification />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute requireAuth>
            <AdminReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute requireAuth>
            <AccountSettings />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App