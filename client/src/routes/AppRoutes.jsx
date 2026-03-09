import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "../pages/Login"
import Register from "../pages/Register"
import Discover from "../pages/Discover"
import Likes from "../pages/Likes"
import Matches from "../pages/Matches"
import Chat from "../pages/Chat"
import CreateProfile from "../pages/CreateProfile"
import Profile from "../pages/Profile"
import EditProfile from "../pages/EditProfile"
import MessageRequests from "../pages/MessageRequests"
import Favorites from "../pages/Favorites"
import IncomingLikes from "../pages/IncomingLikes"

import ProtectedRoute from "../components/ProtectedRoute"

export default function AppRoutes() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Public routes */}

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}

        <Route
          path="/discover"
          element={
            <ProtectedRoute>
              <Discover />
            </ProtectedRoute>
          }
        />

        <Route
          path="/likes"
          element={
            <ProtectedRoute>
              <IncomingLikes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:matchId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-profile"
          element={
            <ProtectedRoute>
              <CreateProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route path="/message-requests" element={<MessageRequests />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/incoming-likes" element={<IncomingLikes />} />

      </Routes>

    </BrowserRouter>
  )
}