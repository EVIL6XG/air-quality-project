import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AQILineChart from "../components/Pm";
import { getPM25History } from "../api/api";

function calculateAQI(pm) {
  if (pm === null || pm === undefined) return 0;
  const c = Math.floor(pm * 10) / 10;
  if (c <= 12.0) return Math.round(((50 - 0) / (12.0 - 0)) * (c - 0) + 0);
  if (c <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (c - 12.1) + 51);
  if (c <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (c - 35.5) + 101);
  if (c <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (c - 55.5) + 151);
  if (c <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (c - 150.5) + 201);
  return 500;
}

function normalizeDate(dateStr) {
  return dateStr?.slice(0, 10);
}

export default function DashboardPage() {
  const [searchParams] = useSearchParams();
  const districtFromUrl = searchParams.get("district");

  const [districtId, setDistrictId] = useState(districtFromUrl || "1");
  const [viewType, setViewType] = useState("pm25");

  const [pmHistory, setPmHistory] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (districtFromUrl && districtFromUrl !== districtId) {
      setDistrictId(districtFromUrl);
    }
  }, [districtFromUrl, districtId]);

  useEffect(() => {
    if (!districtId) return;
    setFetchError(false);
    getPM25History(districtId)
      .then((res) => {
        const data = res?.data || res;
        setPmHistory(Array.isArray(data) ? data : []);
      })
      .catch(() => setFetchError(true));
  }, [districtId]);

  const filteredData = useMemo(() => {
    return pmHistory.filter((item) => {
      if (!item.date || item.pm25_median == null) return false;
      const d = normalizeDate(item.date);
      if (fromDate && d < fromDate) return false;
      if (toDate && d > toDate) return false;
      return true;
    });
  }, [pmHistory, fromDate, toDate]);

  const chartData = useMemo(() => {
    return filteredData.map((item) => ({
      date: normalizeDate(item.date),
      value: viewType === "aqi"
        ? (item.aqi || calculateAQI(Number(item.pm25_median)))
        : Number(item.pm25_median),
    }));
  }, [filteredData, viewType]);

  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;

    const pmValues = filteredData.map((d) => Number(d.pm25_median));
    const aqiValues = filteredData.map((d) => d.aqi || calculateAQI(Number(d.pm25_median)));

    const avgPm = Math.round(pmValues.reduce((a, b) => a + b, 0) / pmValues.length);
    const avgAqi = Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length);
    const maxPm = Math.max(...pmValues);

    return { avgPm, avgAqi, maxPm, minPm: Math.min(...pmValues) };
  }, [filteredData]);

  function getAqiInfo(aqi) {
    if (aqi <= 50) return { label: "Good", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" };
    if (aqi <= 100) return { label: "Moderate", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30" };
    if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" };
    return { label: "Unhealthy", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" };
  }

  if (fetchError) {
    return (
      <div className="p-6 bg-[#F8FAFC] dark:bg-[#0F1117] min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-[#1A1D2E] p-8 rounded-xl shadow-sm text-center max-w-md">
          <p className="text-2xl mb-2">⚠️</p>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Backend unavailable</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Could not connect to the API at <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">http://127.0.0.1:5000</code>.
            Make sure the Flask backend is running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F8FAFC] dark:bg-[#0F1117] min-h-screen space-y-6">

      {/* HEADER & TOGGLE */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white dark:bg-[#1A1D2E] p-5 rounded-xl shadow-sm border dark:border-gray-800">
        <div className="flex flex-wrap gap-6">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">District</label>
            <select
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
              className="block mt-1 px-4 py-2 border dark:border-gray-700 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-[#0F1117] text-gray-800 dark:text-gray-200"
            >
              <option value="1">Bostandyk</option>
              <option value="2">Medeu</option>
              <option value="3">Auezov</option>
              <option value="4">Alatau</option>
              <option value="5">Jetisu</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Period From/To</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="px-3 py-2 border dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-[#0F1117] text-gray-800 dark:text-gray-200" />
              <span className="text-gray-300 dark:text-gray-600">—</span>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="px-3 py-2 border dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-[#0F1117] text-gray-800 dark:text-gray-200" />
            </div>
          </div>
        </div>

        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            onClick={() => setViewType("pm25")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${viewType === "pm25" ? "bg-white dark:bg-[#1A1D2E] shadow-sm text-indigo-600" : "text-gray-500 dark:text-gray-400"}`}
          >
            $PM_{2.5}$
          </button>
          <button
            onClick={() => setViewType("aqi")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${viewType === "aqi" ? "bg-white dark:bg-[#1A1D2E] shadow-sm text-indigo-600" : "text-gray-500 dark:text-gray-400"}`}
          >
            AQI Index
          </button>
        </div>
      </div>

      {/* ГРАФИК */}
      <div className="bg-white dark:bg-[#1A1D2E] p-6 rounded-xl shadow-sm border dark:border-gray-800 relative">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
          {viewType === "pm25" ? "Mass Concentration (μg/m³)" : "Air Quality Index (AQI)"}
        </h3>
        <AQILineChart data={chartData} dataKey="value" />
      </div>

      {/* АНАЛИТИКА */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#1A1D2E] p-5 rounded-xl shadow-sm border-l-4 border-blue-500 dark:border-gray-800">
            <h4 className="text-xs font-bold text-gray-400 uppercase">Average $PM_{2.5}$</h4>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.avgPm} <span className="text-sm font-normal text-gray-400">μg/m³</span></p>
          </div>

          <div className="bg-white dark:bg-[#1A1D2E] p-5 rounded-xl shadow-sm border-l-4 border-purple-500 dark:border-gray-800">
            <h4 className="text-xs font-bold text-gray-400 uppercase">Average AQI</h4>
            <p className="text-2xl font-bold text-purple-600 mt-1">{stats.avgAqi}</p>
            <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${getAqiInfo(stats.avgAqi).bg} ${getAqiInfo(stats.avgAqi).color}`}>
              {getAqiInfo(stats.avgAqi).label}
            </span>
          </div>

          <div className="bg-white dark:bg-[#1A1D2E] p-5 rounded-xl shadow-sm border-l-4 border-red-500 dark:border-gray-800">
            <h4 className="text-xs font-bold text-gray-400 uppercase">Peak Concentration</h4>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.maxPm} <span className="text-sm font-normal text-gray-400">μg/m³</span></p>
          </div>

          <div className="bg-white dark:bg-[#1A1D2E] p-5 rounded-xl shadow-sm border-l-4 border-green-500 dark:border-gray-800">
            <h4 className="text-xs font-bold text-gray-400 uppercase">Health Recommendation</h4>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
              {stats.avgAqi > 100 ? "Limit outdoor activities" : "Safe for outdoor exercise"}
            </p>
          </div>
        </div>
      )}

      {stats && (
        <div className="bg-indigo-900 dark:bg-indigo-950 text-white p-6 rounded-xl shadow-lg">
          <h4 className="font-bold mb-2">Expert Analysis</h4>
          <p className="text-indigo-100 text-sm leading-relaxed">
            During the selected period, the average air quality index in the district was <b>{stats.avgAqi}</b>.
            This corresponds to a <b>{getAqiInfo(stats.avgAqi).label.toLowerCase()}</b> level of pollution.
            The maximum observed concentration of particulate matter reached <b>{stats.maxPm} μg/m³</b>.
          </p>
        </div>
      )}
    </div>
  );
}
