import { forwardRef } from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/cn"

export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

export const SelectTrigger = forwardRef(function SelectTrigger(
  { className, children, ...props },
  ref,
) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown size={16} className="text-text-secondary" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})

export const SelectContent = forwardRef(function SelectContent(
  { className, children, position = "popper", ...props },
  ref,
) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        className={cn(
          "z-50 overflow-hidden rounded-lg border border-border-subtle bg-surface-1 text-text-primary shadow-md",
          position === "popper" && "min-w-[var(--radix-select-trigger-width)]",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
})

export const SelectLabel = forwardRef(function SelectLabel(
  { className, ...props },
  ref,
) {
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary",
        className,
      )}
      {...props}
    />
  )
})

export const SelectItem = forwardRef(function SelectItem(
  { className, children, ...props },
  ref,
) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-md py-2 pl-8 pr-2 text-sm outline-none focus:bg-surface-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check size={14} className="text-accent" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
})

export const SelectSeparator = forwardRef(function SelectSeparator(
  { className, ...props },
  ref,
) {
  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn("my-1 h-px bg-border-subtle", className)}
      {...props}
    />
  )
})
