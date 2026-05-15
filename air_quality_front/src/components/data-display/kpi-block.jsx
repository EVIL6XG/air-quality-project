import { cn } from "@/lib/cn"

export function KPIBlock({ title, value, caption, className }) {
  return (
    <section className={cn("space-y-1", className)}>
      <p className="text-sm text-text-secondary">{title}</p>
      <p className="font-display text-3xl font-bold text-text-primary">
        {value}
      </p>
      {caption && <p className="text-sm text-text-secondary">{caption}</p>}
    </section>
  )
}
