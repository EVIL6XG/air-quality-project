import { CloudOff } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/cn"

export function EmptyState({
  icon: Icon = CloudOff,
  title = "No data",
  description,
  action,
  className,
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border border-dashed border-border-subtle p-8 text-center", className)}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-text-secondary">
        <Icon size={22} />
      </div>
      <h3 className="font-display text-base font-semibold text-text-primary">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-4"><Button {...action} /></div>}
    </div>
  )
}
