import { Link } from "react-router-dom"
import { ArrowLeft, CalendarDays, Newspaper } from "lucide-react"

const articles = [
  {
    title: "Seasonal air quality patterns in Almaty",
    date: "Research note",
    text: "Short updates about winter inversions, district-level PM2.5 behavior, and how forecasting helps interpret local changes.",
  },
  {
    title: "How AirQ turns monitoring data into public insight",
    date: "Platform update",
    text: "A concise overview of dashboards, forecasts, map layers, and AI-assisted explanations inside the AirQ application.",
  },
  {
    title: "Health-aware notifications for sensitive groups",
    date: "Product concept",
    text: "Recommendations can help users choose safer times for outdoor activity when PM2.5 levels increase.",
  },
]

export default function NewsPage() {
  return (
    <main className="airq-info-page">
      <div className="airq-info-bg" />
      <section className="airq-info-card">
        <Link className="airq-info-back" to="/">
          <ArrowLeft size={16} />
          Back to AirQ
        </Link>
        <p className="airq-info-kicker">News</p>
        <h1>AirQ updates and research notes</h1>
        <p className="airq-info-lead">
          Selected platform updates and environmental intelligence materials
          focused on air quality monitoring in Almaty.
        </p>

        <div className="mt-8 grid gap-4">
          {articles.map((article) => (
            <article
              key={article.title}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-5"
            >
              <div className="mb-3 flex items-center gap-2 text-sm text-cyan-100/75">
                <Newspaper size={16} />
                <span>{article.date}</span>
                <CalendarDays size={15} />
              </div>
              <h2 className="font-display text-xl font-semibold text-white">
                {article.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-200/75">
                {article.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
