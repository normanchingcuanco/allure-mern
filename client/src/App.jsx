import { Routes, Route } from "react-router-dom"

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
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      <Route path="/discover" element={<Discover />} />

      <Route path="/create-profile" element={<CreateProfile />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/profile/:userId" element={<Profile />} />

      <Route path="/favorites" element={<Favorites />} />
      <Route path="/likes" element={<Likes />} />
      <Route path="/incoming-likes" element={<IncomingLikes />} />

      <Route path="/matches" element={<Matches />} />
      <Route path="/chat/:matchId" element={<Chat />} />

      <Route path="/message-requests" element={<MessageRequests />} />
      <Route path="/blocked-users" element={<BlockedUsers />} />

      <Route path="/verification-request" element={<VerificationRequest />} />
      <Route path="/admin/verification" element={<AdminVerification />} />
      <Route path="/admin/reports" element={<AdminReports />} />

      <Route path="/settings" element={<AccountSettings />} />
    </Routes>
  )
}

export default App