import { Link, Navigate, useParams } from "react-router-dom"
import { ArrowLeft, Clock3, Home } from "lucide-react"

import { learnTopicsBySlug } from "@/data/learn-topics"

export default function LearnTopicPage() {
  const { slug } = useParams()
  const topic = learnTopicsBySlug[slug]

  if (!topic) {
    return <Navigate to="/learn" replace />
  }

  const { title, summary, icon: Icon, sections, readTime } = topic

  return (
    <main className="airq-info-page min-h-screen text-white">
      <div className="airq-info-bg" />
      <article className="relative z-10 mx-auto w-[min(100%-1.5rem,920px)] py-8 md:py-12">
        <div className="mb-5 flex flex-wrap gap-2">
          <Link className="airq-info-back" to="/learn">
            <ArrowLeft size={16} />
            Back to Learn
          </Link>
          <Link className="airq-info-back" to="/">
            <Home size={16} />
            Home
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_26px_80px_rgba(2,8,23,.45)] md:p-8">
          <div className="inline-flex rounded-xl bg-cyan-300/10 p-2 text-cyan-200">
            <Icon size={18} />
          </div>
          <p className="airq-info-kicker mt-4">AirQ Learn</p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-white md:text-4xl">
            {title}
          </h1>
          <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-300">
            <Clock3 size={14} />
            {readTime || "5 min read"}
          </div>
          <p className="mt-5 text-base leading-8 text-slate-200/95 md:text-[1.05rem]">
            {summary}
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/55 p-5 md:p-8">
          {sections.map((section, index) => (
            <section key={section.heading} className={index > 0 ? "mt-8" : ""}>
              <h2 className="font-display text-xl font-semibold text-white md:text-2xl">
                {section.heading}
              </h2>
              <p className="mt-3 text-[0.98rem] leading-8 text-slate-200/95 md:text-[1.04rem]">
                {section.text}
              </p>
            </section>
          ))}

          <div className="mt-10 rounded-xl border border-cyan-200/20 bg-cyan-300/10 p-4 text-sm leading-7 text-slate-100/95">
            AirQ note: district-level conditions in Almaty may vary across the same day, therefore AQI and PM2.5 should be interpreted together with local map context and forecast trends.
          </div>
        </div>
      </article>
    </main>
  )
}
