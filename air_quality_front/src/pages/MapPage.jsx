import { useState } from "react"
import {
  CalendarDays,
  Layers3,
  Maximize2,
  Minimize2,
  RadioTower,
  Wind,
} from "lucide-react"

import AQIMap from "@/components/AQIMap"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { IconButton } from "@/components/ui/icon-button"

const legend = [
  ["#22c55e", "Good"],
  ["#eab308", "Moderate"],
  ["#f97316", "Sensitive"],
  ["#ef4444", "Unhealthy"],
  ["#881337", "Hazardous"],
]

export default function MapPage() {
  const [selectedDate, setSelectedDate] = useState("2024-12-24")
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[999] bg-surface-0">
        <IconButton
          type="button"
          onClick={() => setIsFullscreen(false)}
          className="glass absolute right-4 top-4 z-[1000]"
          aria-label="Exit fullscreen"
        >
          <Minimize2 size={20} />
        </IconButton>
        <AQIMap selectedDate={selectedDate} fullscreen />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <Card className="atmos-card rounded-[2rem] p-5">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <Badge className="mb-4 border-cyan-200/30 bg-cyan-200/15 text-cyan-700 dark:text-cyan-100">
              <RadioTower size={14} />
              map-first experience
            </Badge>
            <h1 className="font-display text-4xl font-bold">Almaty live map</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Readable street map with labels, AQI heatmap, district borders,
              live station markers, mouse hover states, and full zoom controls.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="glass flex h-11 items-center gap-3 rounded-xl px-4">
              <CalendarDays size={16} className="text-accent" />
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="bg-transparent text-sm outline-none"
              />
            </label>
            <IconButton
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="glass"
              aria-label="Fullscreen"
            >
              <Maximize2 size={18} />
            </IconButton>
          </div>
        </div>
      </Card>

      <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card className="atmos-card rounded-[2rem] p-2">
          <AQIMap selectedDate={selectedDate} fullHeight />
        </Card>

        <div className="space-y-5">
          <Card className="atmos-card rounded-[2rem] p-5">
            <Layers3 className="mb-4 text-accent" size={22} />
            <h2 className="font-display text-xl font-bold">Weather overlays</h2>
            <div className="mt-4 space-y-3">
              {["Readable labels", "AQI heatmap", "District borders", "Station markers"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/10 px-4 py-3"
                  >
                    <span className="text-sm">{item}</span>
                    <span className="pulse-live h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  </div>
                ),
              )}
            </div>
          </Card>

          <Card className="atmos-card rounded-[2rem] p-5">
            <Wind className="mb-4 text-accent" size={22} />
            <h2 className="font-display text-xl font-bold">AQI legend</h2>
            <div className="mt-4 space-y-3">
              {legend.map(([color, label]) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <span
                    className="h-3 w-3 rounded-full shadow-[0_0_18px_currentColor]"
                    style={{ backgroundColor: color, color }}
                  />
                  <span className="text-text-secondary">{label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
