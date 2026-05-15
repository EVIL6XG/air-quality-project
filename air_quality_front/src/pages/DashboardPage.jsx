import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  Activity,
  BrainCircuit,
  CloudSun,
  HeartPulse,
  Leaf,
  RadioTower,
  TrendingUp,
  Wind,
} from "lucide-react"

import AQIMap from "@/components/AQIMap"
import AQILineChart from "@/components/Pm"
import { AQIDial } from "@/components/data-display/aqi-dial"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { usePM25History } from "@/features/aqi/queries"
import { aqiCategory } from "@/lib/aqi"
import { cn } from "@/lib/cn"
import { useFilterStore } from "@/stores/filters-store"

const districts = [
  { id: "1", name: "Bostandyk", wind: "12 km/h", no2: 19, score: 82 },
  { id: "2", name: "Medeu", wind: "9 km/h", no2: 16, score: 42 },
  { id: "3", name: "Auezov", wind: "7 km/h", no2: 28, score: 78 },
  { id: "4", name: "Alatau", wind: "14 km/h", no2: 22, score: 91 },
  { id: "5", name: "Jetisu", wind: "8 km/h", no2: 31, score: 73 },
]

function calculateAQI(pm) {
  if (pm === null || pm === undefined) return 0
  const c = Math.floor(pm * 10) / 10
  if (c <= 12.0) return Math.round(((50 - 0) / (12.0 - 0)) * c)
  if (c <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (c - 12.1) + 51)
  if (c <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (c - 35.5) + 101)
  if (c <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (c - 55.5) + 151)
  if (c <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (c - 150.5) + 201)
  return 500
}

function normalizeDate(dateStr) {
  return dateStr?.slice(0, 10)
}

function MiniMetric({ label, value, unit, icon: Icon, tone = "text-accent" }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
          {label}
        </p>
        <Icon size={16} className={tone} />
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <p className={cn("font-display text-2xl font-bold", tone)}>{value}</p>
        {unit && <span className="text-xs text-text-secondary">{unit}</span>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [searchParams] = useSearchParams()
  const districtFromUrl = searchParams.get("district")
  const [viewType, setViewType] = useState("pm25")

  const districtId = useFilterStore((state) => state.selectedDistrictId)
  const setDistrictId = useFilterStore((state) => state.setSelectedDistrictId)
  const fromDate = useFilterStore((state) => state.dateFrom)
  const toDate = useFilterStore((state) => state.dateTo)
  const setDateRange = useFilterStore((state) => state.setDateRange)

  const { data: pmHistory = [], isError: fetchError } = usePM25History(districtId)

  useEffect(() => {
    if (districtFromUrl && districtFromUrl !== districtId) {
      setDistrictId(districtFromUrl)
    }
  }, [districtFromUrl, districtId, setDistrictId])

  const filteredData = useMemo(() => {
    return pmHistory.filter((item) => {
      if (!item.date || item.pm25_median == null) return false
      const date = normalizeDate(item.date)
      if (fromDate && date < fromDate) return false
      if (toDate && date > toDate) return false
      return true
    })
  }, [pmHistory, fromDate, toDate])

  const chartData = useMemo(() => {
    return filteredData.map((item) => ({
      date: normalizeDate(item.date),
      value:
        viewType === "aqi"
          ? item.aqi || calculateAQI(Number(item.pm25_median))
          : Number(item.pm25_median),
    }))
  }, [filteredData, viewType])

  const stats = useMemo(() => {
    if (!filteredData.length) {
      const fallback = districts.find((district) => district.id === districtId)
      return {
        avgPm: fallback?.score ? Math.round(fallback.score / 2.8) : 28,
        avgAqi: fallback?.score ?? 74,
        maxPm: fallback?.score ? Math.round(fallback.score / 1.9) : 48,
        minPm: 18,
      }
    }

    const pmValues = filteredData.map((item) => Number(item.pm25_median))
    const aqiValues = filteredData.map((item) =>
      item.aqi || calculateAQI(Number(item.pm25_median)),
    )

    return {
      avgPm: Math.round(pmValues.reduce((sum, value) => sum + value, 0) / pmValues.length),
      avgAqi: Math.round(aqiValues.reduce((sum, value) => sum + value, 0) / aqiValues.length),
      maxPm: Math.max(...pmValues),
      minPm: Math.min(...pmValues),
    }
  }, [filteredData, districtId])

  const currentDistrict =
    districts.find((district) => district.id === districtId) ?? districts[0]
  const category = aqiCategory(stats.avgAqi)

  if (fetchError) {
    return (
      <Card className="atmos-card mx-auto max-w-lg rounded-3xl p-8 text-center">
        <CloudSun className="mx-auto mb-4 text-accent" size={36} />
        <h2 className="font-display text-xl font-bold">Backend unavailable</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Could not connect to the Flask API at http://127.0.0.1:5000.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-text-secondary">
            Almaty, Kazakhstan
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold">
            Air Quality Intelligence
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={districtId}
            onChange={(event) => setDistrictId(event.target.value)}
            className="glass h-10 rounded-xl px-3 text-sm outline-none"
          >
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={fromDate}
            onChange={(event) => setDateRange(event.target.value, toDate)}
            className="glass h-10 rounded-xl px-3 text-sm outline-none"
          />
          <input
            type="date"
            value={toDate}
            onChange={(event) => setDateRange(fromDate, event.target.value)}
            className="glass h-10 rounded-xl px-3 text-sm outline-none"
          />
        </div>
      </div>

      <section className="grid gap-5 xl:grid-cols-[310px_minmax(0,1fr)_280px]">
        <Card className="atmos-card rounded-[2rem] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
            Live Air Quality Index
          </p>
          <div className="mt-4 flex items-end gap-3">
            <p className="font-display text-7xl font-bold text-lime-300">
              {stats.avgAqi}
            </p>
            <div className="pb-3">
              <p className="text-sm text-text-secondary">AQI</p>
              <p className="text-lg font-bold text-lime-300">{category.label}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            Air quality is acceptable for most people.
          </p>
          <div className="mt-6 h-[170px]">
            <AQILineChart data={chartData} dataKey="value" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <MiniMetric icon={Wind} label="PM2.5" value={stats.avgPm} />
            <MiniMetric icon={Activity} label="PM10" value={Math.round(stats.avgPm * 1.7)} />
            <MiniMetric icon={Leaf} label="NO2" value={currentDistrict.no2} />
          </div>
        </Card>

        <Card className="atmos-card rounded-[2rem] p-3">
          <div className="mb-3 flex items-center justify-between px-2">
            <Badge className="border-white/15 bg-white/10 text-text-secondary">
              AQI Layer
            </Badge>
            <Badge className="border-cyan-200/20 bg-cyan-200/15 text-cyan-100">
              <RadioTower size={13} />
              Wind
            </Badge>
          </div>
          <AQIMap selectedDate={toDate || fromDate || undefined} />
        </Card>

        <Card className="atmos-card rounded-[2rem] p-5">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Almaty</p>
              <CloudSun size={18} className="text-accent" />
            </div>
            <div className="mt-5 flex justify-center">
              <AQIDial value={stats.avgAqi} size={142} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-text-secondary">PM2.5</p>
                <p className="font-bold">{stats.avgPm}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">PM10</p>
                <p className="font-bold">{Math.round(stats.avgPm * 1.7)}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">O3</p>
                <p className="font-bold">63</p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold">Top Districts</p>
            <div className="space-y-2">
              {districts
                .slice()
                .sort((a, b) => a.score - b.score)
                .map((district) => (
                  <button
                    key={district.id}
                    type="button"
                    onClick={() => setDistrictId(district.id)}
                    className="flex w-full items-center justify-between rounded-xl bg-white/8 px-3 py-2 text-sm hover:bg-white/12"
                  >
                    <span>{district.name}</span>
                    <span className="font-mono font-bold text-lime-300">
                      {district.score}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-4">
        <Card className="atmos-card rounded-[2rem] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Forecast</h2>
            <select
              value={viewType}
              onChange={(event) => setViewType(event.target.value)}
              className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-xs outline-none"
            >
              <option value="pm25">PM2.5</option>
              <option value="aqi">AQI</option>
            </select>
          </div>
          <div className="h-32">
            <AQILineChart data={chartData} dataKey="value" />
          </div>
        </Card>

        <Card className="atmos-card rounded-[2rem] p-5">
          <HeartPulse className="mb-3 text-lime-300" size={22} />
          <h2 className="font-semibold">Health Impact</h2>
          <div className="mt-4 space-y-2 text-sm">
            {["General", "Children", "Elderly", "Asthma"].map((group, index) => (
              <div key={group} className="flex justify-between">
                <span className="text-text-secondary">{group}</span>
                <span className={index === 0 ? "text-lime-300" : "text-orange-300"}>
                  {index === 0 ? "Moderate" : "Sensitive"}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="atmos-card rounded-[2rem] p-5">
          <Wind className="mb-3 text-accent" size={22} />
          <h2 className="font-semibold">Wind</h2>
          <p className="mt-3 font-display text-3xl font-bold">
            {currentDistrict.wind.split(" ")[0]}
            <span className="ml-1 text-sm text-text-secondary">km/h</span>
          </p>
          <div className="mt-5 h-12 rounded-xl bg-[repeating-linear-gradient(0deg,transparent_0_7px,rgb(34_211_238/0.22)_8px,transparent_10px)]" />
        </Card>

        <Card className="atmos-card rounded-[2rem] p-5">
          <BrainCircuit className="mb-3 text-accent" size={22} />
          <h2 className="font-semibold">AI Summary</h2>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Air quality in {currentDistrict.name} may worsen during low wind
            periods. Consider checking the map before outdoor activity.
          </p>
          <button className="mt-4 w-full rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgb(99_102_241/0.35)]">
            Ask AI Assistant
          </button>
        </Card>
      </section>
    </div>
  )
}
