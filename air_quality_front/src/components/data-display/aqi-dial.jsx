import { aqiCategory } from "@/lib/aqi"
import { cn } from "@/lib/cn"

export function AQIDial({ value = 0, max = 300, size = 120, className }) {
  const category = aqiCategory(value)
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(Number(value) || 0, max)) / max

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgb(var(--surface-2))" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={category.hex}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-xl font-bold text-text-primary">{value}</p>
        <p className="text-xs text-text-secondary">AQI</p>
      </div>
    </div>
  )
}
