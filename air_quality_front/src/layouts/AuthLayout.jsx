import { CloudSun } from "lucide-react"

export default function AuthLayout({ children }) {
  return (
    <main className="grid min-h-screen bg-surface-0 text-text-primary lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1fr)]">
      <section className="hidden items-center justify-center bg-accent p-12 text-accent-foreground lg:flex">
        <div className="max-w-md">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
            <CloudSun size={28} />
          </div>
          <h1 className="font-display text-4xl font-bold">Air Q Almaty</h1>
          <p className="mt-4 text-base text-white/80">
            Analytics workspace for monitoring PM2.5, AQI trends, forecasts,
            and district-level air quality signals.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center p-6">{children}</section>
    </main>
  )
}
