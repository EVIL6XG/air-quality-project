import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/providers/auth-provider"
import { ThemeProvider } from "@/providers/theme-provider"

import { queryClient } from "./query-client"

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>

      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
