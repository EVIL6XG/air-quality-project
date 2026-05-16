import { Bell, LockKeyhole, Palette, Server } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const settings = [
  {
    title: "Account security",
    text: "Password reset is handled through a secure backend token flow.",
    icon: LockKeyhole,
  },
  {
    title: "Notifications",
    text: "Prepare AQI warnings and forecast alerts for future releases.",
    icon: Bell,
  },
  {
    title: "Theme",
    text: "Dark environmental-tech interface is enabled by default.",
    icon: Palette,
  },
  {
    title: "API connection",
    text: "The frontend reads the backend URL from VITE_API_URL.",
    icon: Server,
  },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">
          Settings
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-text-primary md:text-4xl">
          Platform preferences
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
          Manage account-related options and technical configuration points for
          the AirQ application.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {settings.map((item) => {
          const Icon = item.icon

          return (
            <Card key={item.title} variant="glass" className="p-5">
              <div className="flex items-start gap-4">
                <span className="rounded-xl border border-white/10 bg-white/10 p-2 text-accent">
                  <Icon size={18} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {item.text}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </section>

      <Card variant="glass" className="p-5">
        <Card.Title>Authentication note</Card.Title>
        <Card.Description className="mt-2 leading-6">
          Current implementation uses the existing backend JWT authentication.
          Firebase can be added later after installing the Firebase SDK and
          adding project credentials to environment variables.
        </Card.Description>
        <div className="mt-5">
          <Button variant="secondary">Review account</Button>
        </div>
      </Card>
    </div>
  )
}
