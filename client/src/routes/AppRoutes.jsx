import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "../pages/Login"
import Register from "../pages/Register"
import Discover from "../pages/Discover"
import Likes from "../pages/Likes"
import Matches from "../pages/Matches"
import Chat from "../pages/Chat"

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
              <Likes />
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

      </Routes>

    </BrowserRouter>
  )
}