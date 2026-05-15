import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/Button"

export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-border-subtle bg-surface-1 p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertTriangle size={22} />
      </div>
      <h2 className="font-display text-lg font-semibold text-text-primary">
        Something went wrong
      </h2>
      {error?.message && (
        <p className="mt-2 max-w-md text-sm text-text-secondary">
          {error.message}
        </p>
      )}
      {resetErrorBoundary && (
        <Button type="button" className="mt-5" onClick={resetErrorBoundary}>
          Try again
        </Button>
      )}
    </div>
  )
}
