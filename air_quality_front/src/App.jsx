import { Suspense, lazy } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import InfoPage from "./pages/InfoPage"

import AppShell from "./layouts/AppShell"

import { useAuth } from "./providers/auth-provider"

const DashboardPage = lazy(() => import("./pages/DashboardPage"))
const MapPage = lazy(() => import("./pages/MapPage"))
const ForecastPage = lazy(() => import("./pages/ForecastPage"))
const HistoricalAnalyticsPage = lazy(
  () => import("./pages/HistoricalAnalyticsPage"),
)
const ChatPage = lazy(() => import("./pages/ChatPage"))
const ProfilePage = lazy(() => import("./pages/ProfilePage"))
const SettingsPage = lazy(() => import("./pages/SettingsPage"))
const LearnPage = lazy(() => import("./pages/LearnPage"))
const LearnTopicPage = lazy(() => import("./pages/LearnTopicPage"))
const ImpactPage = lazy(() => import("./pages/ImpactPage"))
const ShopPage = lazy(() => import("./pages/ShopPage"))
const CartPage = lazy(() => import("./pages/CartPage"))
const OrdersPage = lazy(() => import("./pages/OrdersPage"))

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
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center bg-surface-0 text-text-primary">
            Loading AirQ...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/info/:slug" element={<InfoPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/learn/:slug" element={<LearnTopicPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/cart" element={protect(<CartPage />)} />
          <Route path="/shop/orders" element={protect(<OrdersPage />)} />

          <Route path="/dashboard" element={protect(<DashboardPage />)} />
          <Route path="/map" element={protect(<MapPage />)} />
          <Route path="/forecast" element={protect(<ForecastPage />)} />
          <Route
            path="/analytics"
            element={protect(<HistoricalAnalyticsPage />)}
          />
          <Route path="/chat" element={protect(<ChatPage />)} />
          <Route path="/profile" element={protect(<ProfilePage />)} />
          <Route path="/settings" element={protect(<SettingsPage />)} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
