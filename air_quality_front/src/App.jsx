import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import DashboardPage from "./pages/DashboardPage"
import MapPage from "./pages/MapPage"
import ForecastPage from "./pages/ForecastPage"
import ChatPage from "./pages/ChatPage"
import ProfilePage from "./pages/ProfilePage"

import AppShell from "./layouts/AppShell"

import { useAuth } from "./providers/auth-provider"

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function protect(element, Layout = AppShell) {
  return (
    <PrivateRoute>
      <Layout>{element}</Layout>
    </PrivateRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="/dashboard" element={protect(<DashboardPage />)} />
        <Route path="/map" element={protect(<MapPage />)} />
        <Route path="/forecast" element={protect(<ForecastPage />)} />
        <Route path="/chat" element={protect(<ChatPage />)} />
        <Route path="/profile" element={protect(<ProfilePage />)} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
