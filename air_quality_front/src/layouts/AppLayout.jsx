import { useState } from "react";
import Navbar from "../components/Navbar";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0F1117] overflow-hidden relative">

        {/* МОБИЛЬНЫЙ БУРГЕР */}
        <button
          className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-white dark:bg-[#1A1D2E] rounded-lg shadow-md border dark:border-gray-700 text-[#5B5BD6]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* САЙДБАР — мобильный (overlay) */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-56
            transition-transform duration-300 ease-in-out
            md:hidden
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <Navbar onClose={() => setMobileOpen(false)} />
        </aside>

        {/* САЙДБАР — десктопный (в потоке) */}
        <aside
          className={`
            hidden md:block overflow-hidden
            transition-all duration-300 ease-in-out flex-shrink-0
            ${desktopOpen ? "w-56" : "w-0"}
          `}
        >
          <Navbar onClose={() => {}} />
        </aside>

        {/* КНОПКА СВЕРНУТЬ/РАЗВЕРНУТЬ САЙДБАР (десктоп) */}
        <button
          className="hidden md:flex items-center justify-center w-5 h-10 self-center flex-shrink-0 bg-white dark:bg-[#1A1D2E] border dark:border-gray-700 rounded-r-lg shadow-sm text-gray-400 dark:text-gray-500 hover:text-[#5B5BD6] hover:border-[#5B5BD6] transition z-10"
          onClick={() => setDesktopOpen(!desktopOpen)}
        >
          {desktopOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* ЗАТЕМНЕНИЕ (мобайл) */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* КОНТЕНТ */}
        <main className="flex-1 h-full overflow-y-auto w-full min-w-0">
          <div className="pt-16 md:pt-0">
            {children}
          </div>
        </main>
    </div>
  );
}
