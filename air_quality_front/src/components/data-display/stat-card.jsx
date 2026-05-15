import { Card } from "@/components/ui/card"
import { cn } from "@/lib/cn"

export function StatCard({ label, value, helper, icon: Icon, trend, className }) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-text-secondary">
            {label}
          </p>
          <p className="mt-2 truncate font-display text-2xl font-bold text-text-primary">
            {value}
          </p>
          {helper && <p className="mt-1 text-sm text-text-secondary">{helper}</p>}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Icon size={18} />
          </div>
        )}
      </div>
      {trend && <div className="mt-4 text-sm text-text-secondary">{trend}</div>}
    </Card>
  )
}
