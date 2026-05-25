import { Link } from "react-router-dom"
import { ArrowLeft, BookMarked, Clock3, Home } from "lucide-react"
import { learnTopics } from "@/data/learn-topics"

export default function LearnPage() {
  return (
    <main className="airq-info-page min-h-screen text-white">
      <div className="airq-info-bg" />
      <section className="relative z-10 mx-auto w-[min(100%-1.25rem,980px)] py-8">
        <div className="mb-4 flex flex-wrap gap-2">
          <Link className="airq-info-back" to="/">
            <ArrowLeft size={16} />
            Back
          </Link>
          <Link className="airq-info-back" to="/">
            <Home size={16} />
            Home
          </Link>
        </div>

        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 shadow-[0_26px_80px_rgba(2,8,23,.45)] md:p-6">
          <div className="mb-3 flex items-center gap-2 text-slate-200">
            <BookMarked size={16} className="text-indigo-200" />
            <h1 className="text-lg font-semibold">Learn by topic</h1>
          </div>
          <p className="mb-5 text-sm leading-7 text-slate-300/85">
            Open a full article and read the topic in a continuous scientific style.
          </p>

          <div className="space-y-3">
            {learnTopics.map((topic) => (
              <Link
                key={topic.slug}
                to={`/learn/${topic.slug}`}
                className="block rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-200/40 hover:bg-white/[0.06]"
              >
                <h2 className="text-xl font-semibold text-white">{topic.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-200/90">{topic.summary}</p>
                <p className="mt-3 inline-flex items-center gap-1 text-xs text-slate-300/90">
                  <Clock3 size={13} />
                  {topic.readTime || "5 min read"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
