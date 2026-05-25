import { useState } from "react"
import { useForecast } from "@/features/forecast/queries"
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

const DISTRICTS = [
  { id: 1, name: "Bostandyk" },
  { id: 2, name: "Medeu" },
  { id: 3, name: "Auezov" },
  { id: 4, name: "Alatau" },
  { id: 5, name: "Jetisu" },
]

function getPm25Label(pm) {
  if (pm <= 12) return { label: "Good", color: "#00e400" }
  if (pm <= 35) return { label: "Moderate", color: "#ffff00" }
  if (pm <= 55) return { label: "Unhealthy for Sensitive", color: "#ff7e00" }
  if (pm <= 150) return { label: "Unhealthy", color: "#ff0000" }
  return { label: "Hazardous", color: "#7e0023" }
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border bg-white p-3 text-sm shadow-lg dark:border-gray-700 dark:bg-[#1A1D2E]">
      <p className="mb-1 font-bold text-gray-700 dark:text-gray-200">{label}</p>
      {payload.map(
        (p) =>
          p.value != null && (
            <div key={p.name} style={{ color: p.color }} className="flex gap-2">
              <span>{p.name}:</span>
              <b>{typeof p.value === "number" ? p.value.toFixed(1) : p.value} ug/m3</b>
            </div>
          ),
      )}
    </div>
  )
}

export default function ForecastPage() {
  const [districtId, setDistrictId] = useState(1)
  const [days, setDays] = useState(7)
  const [modelType, setModelType] = useState("ml")

  const { data, isLoading: loading, isError } = useForecast(districtId, days, modelType)
  const error = isError ? "Failed to connect to backend" : null

  const historyPoints = (data?.history || []).map((h) => ({
    date: h.date,
    historical: h.pm25_median,
  }))

  const forecastPoints = (data?.forecast || []).map((f) => ({
    date: f.date,
    predicted: f.pm25_predicted,
    band: [f.pm25_lower, f.pm25_upper],
  }))

  const chartData = [...historyPoints, ...forecastPoints]
  const forecastItems = data?.forecast || []
  const districtName = DISTRICTS.find((d) => d.id === districtId)?.name

  return (
    <div className="min-h-screen space-y-6 bg-[#F8FAFC] p-6 dark:bg-[#0F1117]">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#1A1D2E]">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">PM2.5 Forecast</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Model prediction based on historical data
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={districtId}
            onChange={(e) => setDistrictId(Number(e.target.value))}
            className="rounded-lg border bg-white px-4 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-[#0F1117] dark:text-gray-200"
          >
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-all ${
                  days === d
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-[#1A1D2E]"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>

          <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            {[
              { id: "ml", label: "Classical ML" },
              { id: "dl", label: "Deep Learning" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setModelType(m.id)}
                className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-all ${
                  modelType === m.id
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-[#1A1D2E]"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D2E]">
        <h3 className="mb-4 text-base font-bold text-gray-800 dark:text-gray-100">
          {districtName} - last 60 days + {days}-day forecast (
          {modelType === "dl" ? "Deep Learning" : "Classical ML"})
        </h3>
        {loading && (
          <div className="flex h-64 items-center justify-center text-gray-400 dark:text-gray-600">
            Loading...
          </div>
        )}
        {error && <div className="flex h-64 items-center justify-center text-sm text-red-500">{error}</div>}
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
                label={{ value: "ug/m3", angle: -90, position: "insideLeft", fill: "#9ca3af", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                dataKey="band"
                name="Confidence interval"
                stroke="none"
                fill="#818cf8"
                fillOpacity={0.2}
                connectNulls
              />
              {chartData.find((d) => d.predicted != null) && (
                <ReferenceLine
                  x={chartData.find((d) => d.predicted != null)?.date}
                  stroke="#818cf8"
                  strokeDasharray="4 4"
                  label={{ value: "Forecast starts", fill: "#818cf8", fontSize: 11, position: "top" }}
                />
              )}
              <Line
                dataKey="historical"
                name="Historical PM2.5"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
              <Line
                dataKey="predicted"
                name="Predicted PM2.5"
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

      {!loading && !error && forecastItems.length > 0 && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1D2E]">
          <h3 className="mb-4 text-base font-bold text-gray-800 dark:text-gray-100">Daily Predictions</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {forecastItems.map((f) => {
              const info = getPm25Label(f.pm25_predicted)
              return (
                <div
                  key={f.date}
                  className="rounded-xl border bg-gray-50 p-3 text-center dark:border-gray-800 dark:bg-gray-900"
                >
                  <p className="mb-1 text-xs text-gray-400">{f.date.slice(5)}</p>
                  <p className="text-2xl font-bold" style={{ color: info.color }}>
                    {f.pm25_predicted}
                  </p>
                  <p className="mt-1 text-[10px] text-gray-400">ug/m3</p>
                  <p className="mt-1 text-[10px] font-semibold" style={{ color: info.color }}>
                    {info.label}
                  </p>
                  <p className="mt-1 text-[10px] text-gray-400">
                    {f.pm25_lower}-{f.pm25_upper}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
