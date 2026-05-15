import { forwardRef } from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/cn"

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-surface-2 text-text-primary",
        accent: "bg-accent/15 text-accent",
        success: "bg-aqi-good/15 text-aqi-good",
        warning: "bg-aqi-moderate/15 text-aqi-moderate",
        danger: "bg-aqi-unhealthy/15 text-aqi-unhealthy",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export const Badge = forwardRef(function Badge(
  { className, variant, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
})
