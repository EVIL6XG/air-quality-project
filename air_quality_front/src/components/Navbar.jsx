import { NavLink } from "react-router-dom";
import {
  LogOut,
  Map,
  LayoutDashboard,
  Cloud,
  MessageSquare,
  Sun,
  Moon,
  UserCircle,
} from "lucide-react";
import { useTheme } from "../providers/theme-provider";
import { useAuth } from "../providers/auth-provider";

function Navbar({ onClose }) {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const dark = theme === "dark";

  function handleLogout() {
    logout();
    if (onClose) onClose();
  }

  const linkBase = "flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors";
  const linkInactive = "text-gray-700 dark:text-gray-300 hover:bg-[#F0F1FF] dark:hover:bg-[#2D3150]";
  const linkActive = "bg-[#E6E8FF] dark:bg-[#2D3150] text-[#5B5BD6]";

  return (
    <nav className="h-full w-full bg-[#F5F6FA] dark:bg-[#13151F] border-r dark:border-gray-800 flex flex-col justify-between py-4">

      <div>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/purple.png" alt="Logo" className="h-12 opacity-90" />
        </div>

        {/* Menu Links */}
        <div className="flex flex-col gap-1 px-2">
          <NavLink
            to="/map"
            onClick={onClose}
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            <Map size={18} />
            <span>Map</span>
          </NavLink>

          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/forecast"
            onClick={onClose}
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            <Cloud size={18} />
            <span>Forecast</span>
          </NavLink>

          <NavLink
            to="/chat"
            onClick={onClose}
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            <MessageSquare size={18} />
            <span>Chat</span>
          </NavLink>
        </div>
      </div>

      <div className="px-2 flex flex-col gap-1">
        {/* Profile */}
        <NavLink
          to="/profile"
          onClick={onClose}
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
        >
          <UserCircle size={18} />
          <span>Profile</span>
        </NavLink>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`${linkBase} w-full text-gray-700 dark:text-gray-300 hover:bg-[#F0F1FF] dark:hover:bg-[#2D3150]`}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          <span>{dark ? "Light mode" : "Dark mode"}</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition"
        >
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;