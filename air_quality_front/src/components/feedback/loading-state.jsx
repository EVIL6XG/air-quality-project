import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/cn"

export function LoadingState({ label = "Loading", className }) {
  return (
    <div className={cn("flex min-h-40 items-center justify-center gap-3 text-sm text-text-secondary", className)}>
      <Spinner size="sm" />
      <span>{label}</span>
    </div>
  )
}
