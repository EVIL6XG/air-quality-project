import { forwardRef } from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/cn"

export const Tabs = TabsPrimitive.Root

export const TabsList = forwardRef(function TabsList(
  { className, ...props },
  ref,
) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-1 rounded-lg bg-surface-2 p-1 text-text-secondary",
        className,
      )}
      {...props}
    />
  )
})

export const TabsTrigger = forwardRef(function TabsTrigger(
  { className, ...props },
  ref,
) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-surface-1 data-[state=active]:text-text-primary data-[state=active]:shadow-sm",
        className,
      )}
      {...props}
    />
  )
})

export const TabsContent = forwardRef(function TabsContent(
  { className, ...props },
  ref,
) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
      {...props}
    />
  )
})
