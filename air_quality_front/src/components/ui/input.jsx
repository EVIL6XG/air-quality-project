import { forwardRef } from "react"

import { cn } from "@/lib/cn"

export const Input = forwardRef(function Input(
  { className, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  )
})
