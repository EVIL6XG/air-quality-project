import { useState } from "react";
import AQIMap from "../components/AQIMap";
import { Maximize2, Minimize2 } from "lucide-react";

export default function MapPage() {
  const [selectedDate, setSelectedDate] = useState("2024-12-24");
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[999] bg-white dark:bg-[#0F1117]">
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 z-[1000] p-2 bg-white dark:bg-[#1A1D2E] rounded-xl shadow-lg border dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <Minimize2 size={20} />
        </button>
        <AQIMap selectedDate={selectedDate} fullHeight={false} fullscreen />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 h-full flex flex-col">
      {/* HEADER & FILTERS */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-white dark:bg-[#1A1D2E] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div>
          <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">Almaty Air Pollution Map</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">PM₂.₅ levels: Daily Historical Data</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-2 rounded-xl border dark:border-gray-700">
            <label className="text-xs font-bold text-gray-400 px-2 uppercase">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent outline-none text-sm font-medium cursor-pointer text-gray-800 dark:text-gray-200"
            />
          </div>

          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Fullscreen"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* MAP */}
      <div className="flex-1 bg-white dark:bg-[#1A1D2E] p-2 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden relative min-h-[500px]">
        <AQIMap selectedDate={selectedDate} fullHeight />
      </div>

      {/* LEGEND */}
      <div className="flex flex-wrap gap-4 px-2">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span className="w-3 h-3 rounded-full bg-[#00e400]"></span> Good
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span className="w-3 h-3 rounded-full bg-[#ffff00]"></span> Moderate
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span className="w-3 h-3 rounded-full bg-[#ff7e00]"></span> Unhealthy for Sensitive
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span className="w-3 h-3 rounded-full bg-[#ff0000]"></span> Unhealthy
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span className="w-3 h-3 rounded-full bg-[#7e0023]"></span> Hazardous
        </div>
      </div>
    </div>
  );
}
