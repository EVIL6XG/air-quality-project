import { Download, Filter, LineChart, TrendingDown, TrendingUp } from "lucide-react"
import { useMemo } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/card"
import { usePM25History } from "@/features/aqi/queries"
import { useDistricts } from "@/features/districts/queries"
import { useFilterStore } from "@/stores/filters-store"

export default function HistoricalAnalyticsPage() {
  const districtId = useFilterStore((state) => state.selectedDistrictId)
  const setDistrictId = useFilterStore((state) => state.setSelectedDistrictId)
  const fromDate = useFilterStore((state) => state.dateFrom)
  const toDate = useFilterStore((state) => state.dateTo)
  const setDateRange = useFilterStore((state) => state.setDateRange)
  const { data: districts = [] } = useDistricts()
  const { data: pmHistory = [] } = usePM25History(districtId)

  const trendData = useMemo(() => {
    return pmHistory
      .filter((item) => item.date && item.pm25_median != null)
      .filter((item) => {
        const date = item.date.slice(0, 10)
        if (fromDate && date < fromDate) return false
        if (toDate && date > toDate) return false
        return true
      })
      .map((item) => ({
        date: item.date.slice(0, 10),
        pm25: Number(item.pm25_median),
      }))
  }, [pmHistory, fromDate, toDate])

  const districtName =
    districts.find((district) => String(district.id) === String(districtId))?.name || "District"

  const insights = useMemo(() => {
    const empty = [
      {
        title: "Trend",
        value: "N/A",
        description: "Not enough data for trend comparison.",
        icon: TrendingDown,
      },
      {
        title: "Selected district",
        value: districtName,
        description: "Current analytics scope.",
        icon: TrendingUp,
      },
      {
        title: "Records",
        value: "0",
        description: "No PM2.5 rows in selected range.",
        icon: Download,
      },
    ]

    if (trendData.length < 2) return empty

    const recent = trendData.slice(-7)
    const previous = trendData.slice(-14, -7)
    const avgRecent =
      recent.reduce((sum, item) => sum + Number(item.pm25 || 0), 0) / Math.max(recent.length, 1)
    const avgPrevious =
      previous.reduce((sum, item) => sum + Number(item.pm25 || 0), 0) / Math.max(previous.length, 1)

    let deltaPct = 0
    if (avgPrevious > 0) {
      deltaPct = ((avgRecent - avgPrevious) / avgPrevious) * 100
    }

    const trendIcon = deltaPct <= 0 ? TrendingDown : TrendingUp
    const trendValue = `${deltaPct >= 0 ? "+" : ""}${deltaPct.toFixed(1)}%`

    return [
      {
        title: "Weekly trend",
        value: trendValue,
        description:
          deltaPct <= 0
            ? "Average PM2.5 is lower than previous window."
            : "Average PM2.5 is higher than previous window.",
        icon: trendIcon,
      },
      {
        title: "Selected district",
        value: districtName,
        description: "Analytics and chart data are scoped to current district.",
        icon: TrendingUp,
      },
      {
        title: "Report rows",
        value: String(trendData.length),
        description: "Rows currently visible in the filtered dataset.",
        icon: Download,
      },
    ]
  }, [trendData, districtName])

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">
            Historical analytics
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-text-primary md:text-4xl">
            PM2.5 trends across Almaty
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
            Compare district behavior, inspect changes over time, and prepare
            pollution history for reporting or further model evaluation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={districtId}
            onChange={(event) => setDistrictId(event.target.value)}
            className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm"
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
            className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={toDate}
            onChange={(event) => setDateRange(fromDate, event.target.value)}
            className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm"
          />
          <Button variant="secondary" disabled>
            <Filter size={16} />
            Filters
          </Button>
          <Button disabled>
            <Download size={16} />
            Export
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {insights.map((item) => {
          const Icon = item.icon

          return (
            <Card key={item.title} variant="glass" className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-text-secondary">{item.title}</p>
                  <p className="mt-2 font-display text-2xl font-bold">
                    {item.value}
                  </p>
                </div>
                <span className="rounded-xl border border-white/10 bg-white/10 p-2 text-accent">
                  <Icon size={18} />
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-text-secondary">
                {item.description}
              </p>
            </Card>
          )
        })}
      </section>

      <Card variant="glass" className="p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <Card.Title>District comparison</Card.Title>
            <Card.Description>
              PM2.5 history for {districtName}.
            </Card.Description>
          </div>
          <LineChart className="text-accent" size={22} />
        </div>

        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="historyBostandyk" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="historyMedeu" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(226,232,240,0.6)" />
              <YAxis stroke="rgba(226,232,240,0.6)" />
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.92)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                }}
              />
              <Area
                dataKey="pm25"
                name="PM2.5"
                stroke="#22d3ee"
                fill="url(#historyBostandyk)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
