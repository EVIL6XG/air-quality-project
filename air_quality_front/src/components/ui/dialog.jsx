import { forwardRef } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/cn"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export const DialogPortal = DialogPrimitive.Portal

export const DialogOverlay = forwardRef(function DialogOverlay(
  { className, ...props },
  ref,
) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out",
        className,
      )}
      {...props}
    />
  )
})

export const DialogContent = forwardRef(function DialogContent(
  { className, children, ...props },
  ref,
) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border-subtle bg-surface-1 p-6 text-text-primary shadow-lg outline-none",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close asChild>
          <IconButton
            type="button"
            className="absolute right-3 top-3 h-8 w-8"
            aria-label="Close"
          >
            <X size={16} />
          </IconButton>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})

export const DialogHeader = ({ className, ...props }) => (
  <div className={cn("space-y-1.5 text-left", className)} {...props} />
)

export const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
    {...props}
  />
)

export const DialogTitle = forwardRef(function DialogTitle(
  { className, ...props },
  ref,
) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn("font-display text-lg font-semibold", className)}
      {...props}
    />
  )
})

export const DialogDescription = forwardRef(function DialogDescription(
  { className, ...props },
  ref,
) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-text-secondary", className)}
      {...props}
    />
  )
})
