import { cn } from "@/lib/cn"

export function Stack({ className, gap = 4, ...props }) {
  const gapClass = {
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
  }[gap]

  return <div className={cn("flex flex-col", gapClass, className)} {...props} />
}
