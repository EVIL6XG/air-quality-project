import { useEffect, useState } from "react";
import { getForecast } from "../api/api";
import {
  ComposedChart, Line, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";

const DISTRICTS = [
  { id: 1, name: "Bostandyk" },
  { id: 2, name: "Medeu" },
  { id: 3, name: "Auezov" },
  { id: 4, name: "Alatau" },
  { id: 5, name: "Jetisu" },
];

function getPm25Label(pm) {
  if (pm <= 12)  return { label: "Good",                    color: "#00e400" };
  if (pm <= 35)  return { label: "Moderate",               color: "#ffff00" };
  if (pm <= 55)  return { label: "Unhealthy for Sensitive", color: "#ff7e00" };
  if (pm <= 150) return { label: "Unhealthy",              color: "#ff0000" };
  return          { label: "Hazardous",                     color: "#7e0023" };
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1A1D2E] border dark:border-gray-700 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-bold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      {payload.map((p) => (
        p.value != null && (
          <div key={p.name} style={{ color: p.color }} className="flex gap-2">
            <span>{p.name}:</span>
            <b>{typeof p.value === "number" ? p.value.toFixed(1) : p.value} μg/m³</b>
          </div>
        )
      ))}
    </div>
  );
}

export default function ForecastPage() {
  const [districtId, setDistrictId] = useState(1);
  const [days, setDays] = useState(7);
  const [chartData, setChartData] = useState([]);
  const [forecastItems, setForecastItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getForecast(districtId, days)
      .then((res) => {
        if (res.error) { setError(res.error); return; }

        const historyPoints = (res.history || []).map((h) => ({
          date: h.date,
          historical: h.pm25_median,
        }));

        const forecastPoints = (res.forecast || []).map((f) => ({
          date: f.date,
          predicted: f.pm25_predicted,
          band: [f.pm25_lower, f.pm25_upper],
        }));

        setChartData([...historyPoints, ...forecastPoints]);
        setForecastItems(res.forecast || []);
      })
      .catch(() => setError("Failed to connect to backend"))
      .finally(() => setLoading(false));
  }, [districtId, days]);

  const districtName = DISTRICTS.find((d) => d.id === districtId)?.name;

  return (
    <div className="p-6 bg-[#F8FAFC] dark:bg-[#0F1117] min-h-screen space-y-6">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white dark:bg-[#1A1D2E] p-5 rounded-2xl shadow-sm border dark:border-gray-800">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">PM₂.₅ Forecast</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">ML prediction based on historical data</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <select
            value={districtId}
            onChange={(e) => setDistrictId(Number(e.target.value))}
            className="px-4 py-2 border dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-[#0F1117] text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  days === d
                    ? "bg-white dark:bg-[#1A1D2E] shadow-sm text-indigo-600"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white dark:bg-[#1A1D2E] p-6 rounded-2xl shadow-sm border dark:border-gray-800">
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-4">
          {districtName} — last 60 days + {days}-day forecast
        </h3>
        {loading && (
          <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-600">Loading...</div>
        )}
        {error && (
          <div className="h-64 flex items-center justify-center text-red-500 text-sm">{error}</div>
        )}
        {!loading && !error && (
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickFormatter={(v) => v?.slice(5)}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickFormatter={(v) => `${v}`}
                label={{ value: "μg/m³", angle: -90, position: "insideLeft", fill: "#9ca3af", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* Confidence band */}
              <Area
                dataKey="band"
                name="Confidence interval"
                stroke="none"
                fill="#818cf8"
                fillOpacity={0.2}
                connectNulls
              />

              {/* Divider between history and forecast */}
              {chartData.find((d) => d.predicted != null) && (
                <ReferenceLine
                  x={chartData.find((d) => d.predicted != null)?.date}
                  stroke="#818cf8"
                  strokeDasharray="4 4"
                  label={{ value: "Forecast starts", fill: "#818cf8", fontSize: 11, position: "top" }}
                />
              )}

              {/* Historical */}
              <Line
                dataKey="historical"
                name="Historical PM₂.₅"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                connectNulls
              />

              {/* Forecast */}
              <Line
                dataKey="predicted"
                name="Predicted PM₂.₅"
                stroke="#818cf8"
                strokeWidth={2.5}
                strokeDasharray="6 3"
                dot={{ r: 4, fill: "#818cf8" }}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* FORECAST TABLE */}
      {!loading && !error && forecastItems.length > 0 && (
        <div className="bg-white dark:bg-[#1A1D2E] p-6 rounded-2xl shadow-sm border dark:border-gray-800">
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-4">Daily Predictions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {forecastItems.map((f) => {
              const info = getPm25Label(f.pm25_predicted);
              return (
                <div
                  key={f.date}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-center border dark:border-gray-800"
                >
                  <p className="text-xs text-gray-400 mb-1">{f.date.slice(5)}</p>
                  <p className="text-2xl font-bold" style={{ color: info.color }}>
                    {f.pm25_predicted}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">μg/m³</p>
                  <p className="text-[10px] font-semibold mt-1" style={{ color: info.color }}>
                    {info.label}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {f.pm25_lower}–{f.pm25_upper}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
