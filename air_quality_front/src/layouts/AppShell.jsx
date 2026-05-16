import { Link, useLocation } from "react-router-dom"
import {
  Bell,
  BookOpen,
  Bot,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Home,
  LayoutDashboard,
  LogOut,
  Map,
  Moon,
  Search,
  Settings,
  ShoppingBag,
  Sun,
  TrendingUp,
  User,
} from "lucide-react"

import { IconButton } from "@/components/ui/icon-button"
import { useAuth } from "@/providers/auth-provider"
import { useTheme } from "@/providers/theme-provider"
import { useUIStore } from "@/stores/ui-store"
import { cn } from "@/lib/cn"

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/map", label: "Map", icon: Map },
  { to: "/forecast", label: "Forecast", icon: TrendingUp },
  { to: "/analytics", label: "Analytics", icon: HeartPulse },
  { to: "/chat", label: "AI Chat", icon: Bot },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
]

const publicItems = [
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/shop", label: "Shop", icon: ShoppingBag },
]

const mobileItems = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/map", label: "Map", icon: Map },
  { to: "/forecast", label: "Forecast", icon: TrendingUp },
  { to: "/analytics", label: "History", icon: HeartPulse },
  { to: "/chat", label: "AI", icon: Bot },
  { to: "/profile", label: "Profile", icon: User },
]

const routeTitles = {
  "/dashboard": "Dashboard",
  "/map": "Air Quality Map",
  "/forecast": "Forecast",
  "/analytics": "Historical Analytics",
  "/chat": "AI Assistant",
  "/profile": "Profile",
  "/settings": "Settings",
}

export default function AppShell({ children }) {
  const location = useLocation()
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const openPalette = useUIStore((state) => state.openPalette)

  return (
    <div className="premium-shell flex h-screen overflow-hidden text-text-primary">
      <aside
        className={cn(
          "glass hidden shrink-0 border-r border-white/10 transition-all duration-300 md:flex md:flex-col",
          sidebarOpen ? "w-60" : "w-16",
        )}
      >
        <Link
          to="/"
          className="flex h-16 items-center gap-3 border-b border-white/10 px-4 transition-opacity hover:opacity-85"
        >
          <img
            src="/purple.png"
            alt="Air Q Almaty logo"
            className="h-10 w-10 shrink-0 object-contain drop-shadow-[0_0_18px_rgb(34_211_238/0.35)]"
          />
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold">
                Air Q Almaty
              </p>
              <p className="truncate text-xs text-text-secondary">
                Monitoring
              </p>
            </div>
          )}
        </Link>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.to

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary",
                  active && "bg-accent/10 text-accent",
                  !sidebarOpen && "justify-center px-0",
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={18} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}

          <div className="px-3 pt-5">
            {sidebarOpen && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                Explore
              </p>
            )}
          </div>

          {publicItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.to

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary",
                  active && "bg-accent/10 text-accent",
                  !sidebarOpen && "justify-center px-0",
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={18} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border-subtle p-2">
          <button
            type="button"
            onClick={logout}
            className={cn(
              "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary",
              !sidebarOpen && "justify-center px-0",
            )}
            title={!sidebarOpen ? "Logout" : undefined}
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <IconButton
              type="button"
              onClick={toggleSidebar}
              className="hidden md:inline-flex"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <ChevronLeft size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </IconButton>
            <h1 className="truncate font-display text-lg font-bold">
              {routeTitles[location.pathname] ?? "Air Quality"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openPalette}
              className="hidden h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 text-sm text-text-secondary transition-colors hover:bg-white/15 sm:flex"
            >
              <Search size={16} />
              <span>Search</span>
              <kbd className="rounded border border-border-subtle bg-surface-2 px-1.5 py-0.5 font-mono text-[11px]">
                Ctrl K
              </kbd>
            </button>
            <IconButton type="button" aria-label="Notifications">
              <Bell size={18} />
            </IconButton>
            <IconButton
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="mx-auto w-full max-w-7xl p-4 md:p-8">{children}</div>
        </main>
      </div>

      <nav className="glass fixed inset-x-3 bottom-3 z-40 grid grid-cols-6 rounded-xl p-1 shadow-lg md:hidden">
        {mobileItems.map((item) => {
          const Icon = item.icon
          const active = location.pathname === item.to

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex h-12 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium text-text-secondary transition-colors",
                active && "bg-accent text-accent-foreground",
              )}
            >
              <Icon size={17} />
              <span className="max-w-full truncate px-1">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
