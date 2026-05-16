import {
  Download,
  Filter,
  LineChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const trendData = [
  { date: "Mon", bostandyk: 18, medeu: 22, auezov: 28 },
  { date: "Tue", bostandyk: 21, medeu: 24, auezov: 31 },
  { date: "Wed", bostandyk: 26, medeu: 29, auezov: 35 },
  { date: "Thu", bostandyk: 23, medeu: 27, auezov: 33 },
  { date: "Fri", bostandyk: 19, medeu: 21, auezov: 25 },
  { date: "Sat", bostandyk: 16, medeu: 19, auezov: 22 },
  { date: "Sun", bostandyk: 17, medeu: 20, auezov: 24 },
]

const insights = [
  {
    title: "Weekly trend",
    value: "-12%",
    description: "Average PM2.5 is lower than the previous week.",
    icon: TrendingDown,
  },
  {
    title: "Highest district",
    value: "Auezov",
    description: "The district shows the strongest evening peaks.",
    icon: TrendingUp,
  },
  {
    title: "Report ready",
    value: "CSV",
    description: "Historical data can be exported for diploma analysis.",
    icon: Download,
  },
]

export default function HistoricalAnalyticsPage() {
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
          <Button variant="secondary">
            <Filter size={16} />
            Filters
          </Button>
          <Button>
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
              Example weekly PM2.5 profile for selected districts.
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
                dataKey="bostandyk"
                name="Bostandyk"
                stroke="#22d3ee"
                fill="url(#historyBostandyk)"
                strokeWidth={2}
              />
              <Area
                dataKey="medeu"
                name="Medeu"
                stroke="#34d399"
                fill="url(#historyMedeu)"
                strokeWidth={2}
              />
              <Area
                dataKey="auezov"
                name="Auezov"
                stroke="#a78bfa"
                fill="transparent"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
