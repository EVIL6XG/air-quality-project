import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Activity, CloudSun, Leaf, TrendingUp, Wind } from "lucide-react"

import AQILineChart from "@/components/Pm"
import { AQIDial } from "@/components/data-display/aqi-dial"
import { Card } from "@/components/ui/card"
import { useAQIForDate, usePM25History } from "@/features/aqi/queries"
import { useDistricts } from "@/features/districts/queries"
import { useStatsSummary } from "@/features/stats/queries"
import { aqiCategory } from "@/lib/aqi"
import { useFilterStore } from "@/stores/filters-store"

function normalizeDate(dateStr) {
  return dateStr?.slice(0, 10)
}

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

function aqiHealthLabel(aqi) {
  if (aqi <= 50) return "Low risk"
  if (aqi <= 100) return "Moderate risk"
  if (aqi <= 150) return "Sensitive groups"
  if (aqi <= 200) return "High risk"
  return "Very high risk"
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

  const { data: districts = [] } = useDistricts()
  const { data: pmHistory = [], isError: pmFetchError } = usePM25History(districtId)
  const { data: aqiData = [] } = useAQIForDate(toDate || fromDate || undefined)
  const { data: statsSummary = [] } = useStatsSummary()

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

  const historyChartData = useMemo(() => {
    return filteredData.map((item) => ({
      date: normalizeDate(item.date),
      value:
        viewType === "aqi"
          ? item.aqi || calculateAQI(Number(item.pm25_median))
          : Number(item.pm25_median),
    }))
  }, [filteredData, viewType])

  const currentDistrictAqi = useMemo(() => {
    const district = aqiData.find((item) => String(item.district_id) === String(districtId))
    if (!district) return null
    return district.aqi ?? null
  }, [aqiData, districtId])

  const stats = useMemo(() => {
    if (!filteredData.length) {
      return { avgPm: 0, maxPm: 0, minPm: 0 }
    }
    const pmValues = filteredData.map((item) => Number(item.pm25_median))
    return {
      avgPm: Math.round(pmValues.reduce((sum, value) => sum + value, 0) / pmValues.length),
      maxPm: Math.max(...pmValues),
      minPm: Math.min(...pmValues),
    }
  }, [filteredData])

  const avgAqi = currentDistrictAqi ?? calculateAQI(stats.avgPm)
  const category = aqiCategory(avgAqi)
  const districtName =
    districts.find((district) => String(district.id) === String(districtId))?.name || "District"
  const districtSummary = statsSummary.find(
    (item) => item.district?.toLowerCase() === districtName.toLowerCase(),
  )

  if (pmFetchError) {
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
          <p className="text-sm font-medium text-text-secondary">Almaty, Kazakhstan</p>
          <h1 className="mt-1 font-display text-4xl font-bold">Air Quality Intelligence</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={districtId}
            onChange={(event) => setDistrictId(event.target.value)}
            className="glass h-10 rounded-xl px-3 text-sm outline-none"
          >
            {districts.map((district) => (
              <option key={district.id} value={String(district.id)}>
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

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="atmos-card rounded-[2rem] p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
              Live Air Quality Index
            </p>
            <select
              value={viewType}
              onChange={(event) => setViewType(event.target.value)}
              className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-xs outline-none"
            >
              <option value="pm25">PM2.5</option>
              <option value="aqi">AQI</option>
            </select>
          </div>
          <div className="mt-4 flex items-end gap-3">
            <p className="font-display text-7xl font-bold text-lime-300">{avgAqi}</p>
            <div className="pb-3">
              <p className="text-sm text-text-secondary">AQI</p>
              <p className="text-lg font-bold text-lime-300">{category.label}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-text-secondary">Current district: {districtName}</p>
          <div className="mt-6 h-[340px]">
            <AQILineChart data={historyChartData} dataKey="value" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
                  PM2.5
                </p>
                <Wind size={16} className="text-accent" />
              </div>
              <p className="mt-3 text-2xl font-bold text-accent">{stats.avgPm || "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
                  Max PM
                </p>
                <TrendingUp size={16} className="text-accent" />
              </div>
              <p className="mt-3 text-2xl font-bold text-accent">{stats.maxPm || "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
                  Min PM
                </p>
                <Leaf size={16} className="text-accent" />
              </div>
              <p className="mt-3 text-2xl font-bold text-accent">{stats.minPm || "-"}</p>
            </div>
          </div>
        </Card>

        <Card className="atmos-card rounded-[2rem] p-5">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{districtName}</p>
              <CloudSun size={18} className="text-accent" />
            </div>
            <div className="mt-5 flex justify-center">
              <AQIDial value={avgAqi} size={142} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-xs text-text-secondary">7d avg AQI</p>
                <p className="font-bold">{districtSummary?.avg_7_days ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">30d avg AQI</p>
                <p className="font-bold">{districtSummary?.avg_30_days ?? "-"}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-white/8 px-3 py-3 text-sm">
            <div className="mb-1 flex items-center gap-2 font-semibold">
              <Activity size={16} className="text-accent" />
              Health impact
            </div>
            <p className="text-text-secondary">{aqiHealthLabel(avgAqi)}</p>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card className="atmos-card rounded-[2rem] p-5">
          <h2 className="font-semibold">Data quality</h2>
          <p className="mt-3 text-sm text-text-secondary">
            Values are rendered from backend AQI/PM2.5 endpoints. Static district scores and fake pollutant values were removed.
          </p>
        </Card>

        <Card className="atmos-card rounded-[2rem] p-5">
          <h2 className="font-semibold">AI summary</h2>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Current AQI in {districtName} is {avgAqi}. Category: {category.label}. Health status: {aqiHealthLabel(avgAqi)}.
          </p>
        </Card>
      </section>
    </div>
  )
}
