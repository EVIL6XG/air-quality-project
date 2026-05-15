import { forwardRef } from "react"

import { cn } from "@/lib/cn"

export const Skeleton = forwardRef(function Skeleton(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-surface-2", className)}
      {...props}
    />
  )
})
