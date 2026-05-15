import { cn } from "@/lib/cn"

export function Grid({ className, cols = "1", ...props }) {
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[cols]

  return <div className={cn("grid gap-4", colsClass, className)} {...props} />
}
