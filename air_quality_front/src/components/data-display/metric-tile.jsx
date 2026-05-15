import { cn } from "@/lib/cn"

const toneClasses = {
  accent: "text-accent",
  good: "text-aqi-good",
  moderate: "text-aqi-moderate",
  usg: "text-aqi-usg",
  unhealthy: "text-aqi-unhealthy",
  danger: "text-aqi-unhealthy",
}

export function MetricTile({ label, value, unit, tone = "accent", className }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border-subtle bg-surface-1 p-4 shadow-sm",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase text-text-secondary">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-1">
        <span
          className={cn(
            "font-display text-2xl font-bold",
            toneClasses[tone] ?? toneClasses.accent,
          )}
        >
          {value}
        </span>
        {unit && <span className="text-sm text-text-secondary">{unit}</span>}
      </div>
    </div>
  )
}
