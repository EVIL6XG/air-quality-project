import { forwardRef } from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight } from "lucide-react"

import { cn } from "@/lib/cn"

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuGroup = DropdownMenuPrimitive.Group
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal
export const DropdownMenuSub = DropdownMenuPrimitive.Sub
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

export const DropdownMenuContent = forwardRef(function DropdownMenuContent(
  { className, sideOffset = 6, ...props },
  ref,
) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-44 overflow-hidden rounded-lg border border-border-subtle bg-surface-1 p-1 text-text-primary shadow-md",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
})

export const DropdownMenuItem = forwardRef(function DropdownMenuItem(
  { className, inset, ...props },
  ref,
) {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none transition-colors focus:bg-surface-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  )
})

export const DropdownMenuCheckboxItem = forwardRef(
  function DropdownMenuCheckboxItem({ className, children, checked, ...props }, ref) {
    return (
      <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        checked={checked}
        className={cn(
          "relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-surface-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className,
        )}
        {...props}
      >
        <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
          <DropdownMenuPrimitive.ItemIndicator>
            <Check size={14} className="text-accent" />
          </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
      </DropdownMenuPrimitive.CheckboxItem>
    )
  },
)

export const DropdownMenuLabel = forwardRef(function DropdownMenuLabel(
  { className, inset, ...props },
  ref,
) {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-xs font-semibold uppercase text-text-secondary",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  )
})

export const DropdownMenuSeparator = forwardRef(function DropdownMenuSeparator(
  { className, ...props },
  ref,
) {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn("my-1 h-px bg-border-subtle", className)}
      {...props}
    />
  )
})

export const DropdownMenuSubTrigger = forwardRef(function DropdownMenuSubTrigger(
  { className, inset, children, ...props },
  ref,
) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        "flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none focus:bg-surface-2",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight size={14} className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  )
})

export const DropdownMenuSubContent = DropdownMenuContent
