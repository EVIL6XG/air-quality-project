import { useEffect, useState } from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"
import { CheckCircle2, Info, XCircle } from "lucide-react"

import { cn } from "@/lib/cn"

const TOAST_EVENT = "aq-toast"

function publishToast(toast) {
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: {
        id: crypto.randomUUID(),
        duration: 3500,
        variant: "default",
        ...toast,
      },
    }),
  )
}

export function useToast() {
  return {
    success: (title, description) =>
      publishToast({ title, description, variant: "success" }),
    error: (title, description) =>
      publishToast({ title, description, variant: "error" }),
    info: (title, description) =>
      publishToast({ title, description, variant: "default" }),
  }
}

const variantStyles = {
  default: {
    icon: Info,
    className: "border-border-subtle",
    iconClassName: "text-accent",
  },
  success: {
    icon: CheckCircle2,
    className: "border-aqi-good/30",
    iconClassName: "text-aqi-good",
  },
  error: {
    icon: XCircle,
    className: "border-aqi-unhealthy/30",
    iconClassName: "text-aqi-unhealthy",
  },
}

export function Toaster() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    function handleToast(event) {
      setToasts((current) => [...current, event.detail])
    }

    window.addEventListener(TOAST_EVENT, handleToast)
    return () => window.removeEventListener(TOAST_EVENT, handleToast)
  }, [])

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map((toast) => {
        const variant = variantStyles[toast.variant] ?? variantStyles.default
        const Icon = variant.icon

        return (
          <ToastPrimitive.Root
            key={toast.id}
            duration={toast.duration}
            onOpenChange={(open) => {
              if (!open) {
                setToasts((current) =>
                  current.filter((item) => item.id !== toast.id),
                )
              }
            }}
            className={cn(
              "grid w-full max-w-sm grid-cols-[auto_1fr] items-start gap-3 rounded-lg border bg-surface-1 p-4 text-text-primary shadow-md",
              variant.className,
            )}
          >
            <Icon size={18} className={cn("mt-0.5", variant.iconClassName)} />
            <div className="min-w-0">
              <ToastPrimitive.Title className="text-sm font-semibold">
                {toast.title}
              </ToastPrimitive.Title>
              {toast.description && (
                <ToastPrimitive.Description className="mt-1 text-sm text-text-secondary">
                  {toast.description}
                </ToastPrimitive.Description>
              )}
            </div>
          </ToastPrimitive.Root>
        )
      })}
      <ToastPrimitive.Viewport className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 outline-none" />
    </ToastPrimitive.Provider>
  )
}
