import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangle,
  ArrowLeft,
  HeartPulse,
  Home,
  Leaf,
  Shield,
  Users,
} from "lucide-react"

const groups = [
  {
    id: "general",
    label: "General population",
    impact: "Irritation of eyes and throat, fatigue, reduced outdoor comfort.",
    action: "Limit heavy outdoor activity when AQI is above 100.",
  },
  {
    id: "children",
    label: "Children",
    impact: "Higher respiratory stress due to faster breathing rate and lung development.",
    action: "Move sports indoors during afternoon/evening peaks.",
  },
  {
    id: "senior",
    label: "Elderly",
    impact: "Increased cardio-respiratory burden and slower recovery after exposure.",
    action: "Shorten outdoor time and monitor symptoms daily.",
  },
  {
    id: "chronic",
    label: "Asthma / chronic disease",
    impact: "Higher risk of attacks and exacerbations during PM2.5 spikes.",
    action: "Use medication plan proactively and avoid high-traffic zones.",
  },
]

function getBand(aqi) {
  if (aqi <= 50) return { label: "Good", tone: "text-emerald-300", bar: "bg-emerald-400", risk: "Low" }
  if (aqi <= 100) return { label: "Moderate", tone: "text-yellow-300", bar: "bg-yellow-400", risk: "Elevated" }
  if (aqi <= 150) return { label: "Unhealthy for Sensitive", tone: "text-orange-300", bar: "bg-orange-400", risk: "High" }
  if (aqi <= 200) return { label: "Unhealthy", tone: "text-rose-300", bar: "bg-rose-400", risk: "Very high" }
  return { label: "Very Unhealthy / Hazardous", tone: "text-fuchsia-300", bar: "bg-fuchsia-400", risk: "Critical" }
}

function getEffects(aqi) {
  if (aqi <= 50) return ["Minimal immediate health impact", "Normal outdoor activity is acceptable"]
  if (aqi <= 100) return ["Sensitive people may feel mild irritation", "Long runs near traffic can worsen symptoms"]
  if (aqi <= 150) return ["Breathing discomfort rises for children and elderly", "Cough and throat irritation become more frequent"]
  if (aqi <= 200) return ["Population-level respiratory complaints increase", "Outdoor sport and prolonged walking are not recommended"]
  return ["Acute respiratory stress risk is significant", "Community-level protective actions are needed"]
}

export default function ImpactPage() {
  const [aqi, setAqi] = useState(128)
  const [group, setGroup] = useState(groups[0].id)

  const band = useMemo(() => getBand(aqi), [aqi])
  const selectedGroup = groups.find((item) => item.id === group) ?? groups[0]
  const effects = useMemo(() => getEffects(aqi), [aqi])

  return (
    <main className="airq-info-page min-h-screen text-white">
      <div className="airq-info-bg" />

      <section className="relative z-10 mx-auto w-[min(100%-1.25rem,1060px)] py-8 md:py-12">
        <div className="mb-5 flex flex-wrap gap-2">
          <Link className="airq-info-back" to="/">
            <ArrowLeft size={16} />
            Back
          </Link>
          <Link className="airq-info-back" to="/">
            <Home size={16} />
            Home
          </Link>
        </div>

        <section className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
          <article className="rounded-2xl border border-white/10 bg-slate-950/68 p-5 shadow-[0_24px_70px_rgba(2,8,23,.45)] md:p-7">
            <p className="airq-info-kicker mt-0">Impact</p>
            <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
              Health consequences of poor air quality
            </h1>
            <p className="mt-4 text-slate-200/90">
              Interactive view of AQI risk, vulnerable groups, and practical response steps.
            </p>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-300">Simulated AQI</span>
                <span className={`font-semibold ${band.tone}`}>{aqi} - {band.label}</span>
              </div>
              <input
                type="range"
                min={0}
                max={300}
                value={aqi}
                onChange={(event) => setAqi(Number(event.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className={`h-full ${band.bar}`} style={{ width: `${Math.min((aqi / 300) * 100, 100)}%` }} />
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-slate-950/68 p-5 shadow-[0_24px_70px_rgba(2,8,23,.45)] md:p-7">
            <div className="inline-flex rounded-xl bg-rose-300/10 p-2 text-rose-200">
              <AlertTriangle size={18} />
            </div>
            <p className="mt-4 text-sm text-slate-300">Current risk level</p>
            <p className={`mt-1 text-2xl font-semibold ${band.tone}`}>{band.risk}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-200/90">
              {effects.map((effect) => (
                <li key={effect} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  <span>{effect}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-5 grid gap-5 md:grid-cols-[1fr_1fr]">
          <article className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-[0_24px_70px_rgba(2,8,23,.45)] md:p-7">
            <div className="mb-4 flex items-center gap-2 text-slate-200">
              <Users size={17} className="text-cyan-200" />
              <h2 className="text-lg font-semibold">Vulnerable groups</h2>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {groups.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGroup(item.id)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                    group === item.id
                      ? "border-cyan-300/45 bg-cyan-300/10 text-cyan-100"
                      : "border-white/10 bg-white/[0.03] text-slate-200 hover:border-white/20"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-200/95">{selectedGroup.impact}</p>
            <p className="mt-3 rounded-xl border border-emerald-300/25 bg-emerald-300/10 p-3 text-sm text-emerald-100">
              {selectedGroup.action}
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-[0_24px_70px_rgba(2,8,23,.45)] md:p-7">
            <div className="mb-4 flex items-center gap-2 text-slate-200">
              <HeartPulse size={17} className="text-fuchsia-200" />
              <h2 className="text-lg font-semibold">PM2.5 penetration model</h2>
            </div>
            <img
              src="/impact-particles-reference.png"
              alt="Diagram of particle size and respiratory penetration"
              className="w-full rounded-xl border border-white/10 object-cover"
            />
            <p className="mt-3 text-sm leading-7 text-slate-200/90">
              Fine PM2.5 particles can pass beyond upper airways and reach alveoli, where repeated exposure can increase long-term risk.
            </p>
          </article>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          <article className="rounded-xl border border-white/10 bg-slate-950/55 p-4">
            <Leaf size={16} className="text-cyan-200" />
            <h3 className="mt-2 text-sm font-semibold">Daily behavior</h3>
            <p className="mt-1 text-sm text-slate-300">Choose lower-traffic routes and ventilate only during cleaner hours.</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-slate-950/55 p-4">
            <Shield size={16} className="text-cyan-200" />
            <h3 className="mt-2 text-sm font-semibold">Protection</h3>
            <p className="mt-1 text-sm text-slate-300">Use fitted masks and indoor filtration on high-AQI days.</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-slate-950/55 p-4">
            <Users size={16} className="text-cyan-200" />
            <h3 className="mt-2 text-sm font-semibold">Community</h3>
            <p className="mt-1 text-sm text-slate-300">Coordinate school/outdoor schedules based on local forecasts.</p>
          </article>
        </section>
      </section>
    </main>
  )
}
