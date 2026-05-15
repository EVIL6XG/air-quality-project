import { forwardRef } from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/cn"

export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export const TooltipContent = forwardRef(function TooltipContent(
  { className, sideOffset = 6, ...props },
  ref,
) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 rounded-md border border-border-subtle bg-surface-1 px-3 py-1.5 text-xs text-text-primary shadow-md",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
})
