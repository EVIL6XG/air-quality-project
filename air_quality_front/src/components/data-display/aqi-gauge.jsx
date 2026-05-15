import { aqiCategory } from "@/lib/aqi"
import { cn } from "@/lib/cn"

export function AQIGauge({ value = 0, max = 300, className }) {
  const category = aqiCategory(value)
  const clamped = Math.max(0, Math.min(Number(value) || 0, max))
  const angle = 180 * (clamped / max)
  const needleX = 50 + 38 * Math.cos((180 - angle) * (Math.PI / 180))
  const needleY = 50 - 38 * Math.sin((180 - angle) * (Math.PI / 180))

  return (
    <div className={cn("w-full max-w-xs", className)}>
      <svg viewBox="0 0 100 60" className="w-full">
        <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="rgb(var(--surface-2))" strokeWidth="10" strokeLinecap="round" />
        <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke={category.hex} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${126 * (clamped / max)} 126`} />
        <line x1="50" y1="50" x2={needleX} y2={needleY} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="50" r="4" fill="currentColor" />
      </svg>
      <div className="text-center">
        <p className="font-display text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-sm text-text-secondary">{category.label}</p>
      </div>
    </div>
  )
}
