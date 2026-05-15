import { forwardRef } from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/cn"

export const Spinner = forwardRef(function Spinner(
  { className, size = 16, ...props },
  ref,
) {
  return (
    <Loader2
      ref={ref}
      size={size}
      className={cn("animate-spin", className)}
      {...props}
    />
  )
})
