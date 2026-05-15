import { cn } from "@/lib/cn"

export function BentoGrid({ className, ...props }) {
  return (
    <div
      className={cn("grid auto-rows-[minmax(160px,auto)] grid-cols-1 gap-4 md:grid-cols-6", className)}
      {...props}
    />
  )
}

export function BentoGridItem({ className, span = 2, ...props }) {
  const spanClass = {
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    6: "md:col-span-6",
  }[span]

  return <div className={cn(spanClass, className)} {...props} />
}
