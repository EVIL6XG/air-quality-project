import { Link } from "react-router-dom"
import { ArrowLeft, BookOpen, Wind } from "lucide-react"

const modules = [
  "What AQI means and how it is interpreted",
  "Why PM2.5 is important for public health",
  "How machine learning forecasts pollution values",
  "How to read district-level environmental dashboards",
]

export default function LearnPage() {
  return (
    <main className="airq-info-page">
      <div className="airq-info-bg" />
      <section className="airq-info-card">
        <Link className="airq-info-back" to="/">
          <ArrowLeft size={16} />
          Back to AirQ
        </Link>
        <p className="airq-info-kicker">Learn</p>
        <h1>Air quality knowledge base</h1>
        <p className="airq-info-lead">
          A compact learning section that explains AQI, PM2.5, forecasts, and
          health recommendations in clear language.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {modules.map((module) => (
            <div
              key={module}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-5"
            >
              <div className="mb-4 inline-flex rounded-xl bg-cyan-300/10 p-2 text-cyan-200">
                {module.includes("PM2.5") ? (
                  <Wind size={18} />
                ) : (
                  <BookOpen size={18} />
                )}
              </div>
              <h2 className="font-display text-lg font-semibold text-white">
                {module}
              </h2>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
