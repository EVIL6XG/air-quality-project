import { Link } from "react-router-dom"
import { ArrowLeft, LifeBuoy, Mail, MessageCircle } from "lucide-react"

const supportItems = [
  {
    title: "Help center",
    text: "Find answers about dashboards, forecasts, maps, accounts, and password recovery.",
    icon: LifeBuoy,
  },
  {
    title: "Contact",
    text: "Send questions about the AirQ platform, data interpretation, or diploma demonstration.",
    icon: Mail,
  },
  {
    title: "Report an issue",
    text: "Describe incorrect data, login problems, or UI behavior that needs review.",
    icon: MessageCircle,
  },
]

export default function SupportPage() {
  return (
    <main className="airq-info-page">
      <div className="airq-info-bg" />
      <section className="airq-info-card">
        <Link className="airq-info-back" to="/">
          <ArrowLeft size={16} />
          Back to AirQ
        </Link>
        <p className="airq-info-kicker">Support</p>
        <h1>Support and account help</h1>
        <p className="airq-info-lead">
          Assistance for users who need help with authentication, password
          recovery, forecasts, or platform features.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {supportItems.map((item) => {
            const Icon = item.icon

            return (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-5"
              >
                <div className="mb-4 inline-flex rounded-xl bg-cyan-300/10 p-2 text-cyan-200">
                  <Icon size={18} />
                </div>
                <h2 className="font-display text-lg font-semibold text-white">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-200/75">
                  {item.text}
                </p>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
