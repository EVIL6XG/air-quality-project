import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  BrainCircuit,
  CalendarDays,
  ChevronRight,
  CloudSun,
  Droplets,
  HeartPulse,
  Leaf,
  Map,
  MapPin,
  Moon,
  Newspaper,
  Play,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Sun,
  ThermometerSun,
  TrendingUp,
  User,
  Wind,
} from "lucide-react"

import { AQIDial } from "@/components/data-display/aqi-dial"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/providers/auth-provider"
import { useTheme } from "@/providers/theme-provider"
import { cn } from "@/lib/cn"

const navItems = [
  { id: "air-quality", label: "Air Quality" },
  { id: "data", label: "Data" },
  { id: "historical-pm25", label: "Historical PM2.5" },
  { id: "air-quality-app", label: "Air Quality App" },
  { id: "learn", label: "Learn" },
  { id: "news", label: "News" },
  { id: "impact", label: "Impact" },
]

const districts = [
  {
    name: "Medeu",
    aqi: 42,
    pm25: 13,
    color: "#22c55e",
    path: "M250 52 L360 74 L372 178 L294 224 L224 158 Z",
    label: [296, 142],
  },
  {
    name: "Bostandyk",
    aqi: 82,
    pm25: 28,
    color: "#f59e0b",
    path: "M170 176 L294 224 L282 342 L164 326 L112 238 Z",
    label: [202, 266],
  },
  {
    name: "Almaly",
    aqi: 68,
    pm25: 22,
    color: "#eab308",
    path: "M112 110 L224 158 L170 176 L112 238 L48 198 L50 130 Z",
    label: [126, 170],
  },
  {
    name: "Auezov",
    aqi: 78,
    pm25: 26,
    color: "#f59e0b",
    path: "M48 198 L112 238 L164 326 L82 374 L18 306 L22 228 Z",
    label: [82, 294],
  },
  {
    name: "Turksib",
    aqi: 104,
    pm25: 39,
    color: "#ef4444",
    path: "M360 74 L470 98 L506 204 L438 284 L372 178 Z",
    label: [424, 178],
  },
  {
    name: "Alatau",
    aqi: 91,
    pm25: 34,
    color: "#f97316",
    path: "M82 374 L164 326 L282 342 L262 452 L136 470 Z",
    label: [184, 398],
  },
  {
    name: "Nauryzbay",
    aqi: 57,
    pm25: 18,
    color: "#eab308",
    path: "M18 306 L82 374 L136 470 L48 488 L0 404 Z",
    label: [62, 410],
  },
  {
    name: "Zhetysu",
    aqi: 73,
    pm25: 24,
    color: "#eab308",
    path: "M282 342 L438 284 L506 204 L534 318 L452 418 L262 452 Z",
    label: [394, 356],
  },
]

const pollutants = [
  { label: "PM2.5", value: "28", unit: "ug/m3", tone: "text-cyan-200", icon: Wind },
  { label: "PM10", value: "48", unit: "ug/m3", tone: "text-sky-200", icon: RadioTower },
  { label: "NO2", value: "18", unit: "ppb", tone: "text-emerald-200", icon: Leaf },
  { label: "SO2", value: "6", unit: "ppb", tone: "text-violet-200", icon: CloudSun },
  { label: "CO", value: "0.7", unit: "ppm", tone: "text-orange-200", icon: ThermometerSun },
  { label: "O3", value: "63", unit: "ppb", tone: "text-purple-200", icon: Sparkles },
]

const newsCards = [
  {
    title: "Evening inversion may increase PM2.5 concentration",
    tag: "Alert",
    text: "Low wind speed can keep pollution close to residential areas after sunset.",
  },
  {
    title: "Medeu district records the cleanest afternoon window",
    tag: "Update",
    text: "Wind corridor activity improved dispersion between 12:00 and 16:00.",
  },
  {
    title: "Tomorrow forecast: moderate AQI across central Almaty",
    tag: "Forecast",
    text: "Sensitive groups should monitor exposure if AQI crosses 100.",
  },
]

const impactGroups = [
  ["Children", "Sensitive", "text-orange-200"],
  ["Elderly", "Sensitive", "text-orange-200"],
  ["Asthma", "High risk", "text-red-200"],
  ["Active people", "Moderate", "text-lime-200"],
]

function scrollToSection(event, id) {
  event.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

function Reveal({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function AtmosphericBackground() {
  return (
    <div className="hero-atmosphere">
      <div className="mountain-hero-scene" aria-hidden="true" />
      <div className="smog-layer smog-layer-back" aria-hidden="true" />
      <div className="smog-layer smog-layer-front" aria-hidden="true" />
      <div className="particle-field" />
      <div className="cloud-layer" />
    </div>
  )
}

function AnimatedLogo() {
  return (
    <div className="animated-logo-badge" aria-hidden="true">
      <span className="logo-smoke-vortex" />
      <span className="logo-smoke-particles" />
      <img src="/image (3).png" alt="" className="animated-logo-image" />
    </div>
  )
}

function HeroBrandMark() {
  return (
    <div className="hero-brand-mark" aria-hidden="true">
      <span className="hero-brand-vortex" />
      <span className="hero-brand-haze" />
      <img src="/purple.png" alt="" className="hero-brand-logo" />
    </div>
  )
}

function GlassCard({ className, children }) {
  return <div className={cn("atmos-card rounded-[2rem]", className)}>{children}</div>
}

function SectionHeader({ eyebrow, title, text }) {
  return (
    <Reveal className="mx-auto mb-10 max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-5xl">
        {title}
      </h2>
      {text && <p className="mt-4 text-base leading-8 text-text-secondary">{text}</p>}
    </Reveal>
  )
}

function PollutantCard({ item }) {
  const Icon = item.icon
  return (
    <GlassCard className="p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgb(34_211_238/0.18)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
          {item.label}
        </p>
        <Icon size={18} className={item.tone} />
      </div>
      <p className={cn("mt-5 font-display text-4xl font-bold", item.tone)}>
        {item.value}
      </p>
      <p className="mt-1 text-sm text-text-secondary">{item.unit}</p>
    </GlassCard>
  )
}

function AQICard({ selectedDistrict }) {
  return (
    <GlassCard className="floating p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-text-secondary">
            Live Air Quality Index
          </p>
          <p className="mt-1 text-sm text-text-secondary">Almaty, Kazakhstan</p>
        </div>
        <span className="pulse-live rounded-full bg-aqi-good px-3 py-1 text-xs font-bold text-white">
          LIVE
        </span>
      </div>
      <div className="grid items-center gap-5 sm:grid-cols-[150px_1fr]">
        <AQIDial value={selectedDistrict.aqi} size={150} />
        <div>
          <p className="font-display text-6xl font-bold text-lime-300">
            {selectedDistrict.aqi}
          </p>
          <p className="mt-1 text-xl font-bold text-lime-200">Moderate</p>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Air quality is acceptable for most people. Sensitive groups should
            reduce prolonged outdoor activity.
          </p>
        </div>
      </div>
    </GlassCard>
  )
}

function AlmatyMapPreview({ selectedDistrict, setSelectedDistrict }) {
  return (
    <GlassCard className="relative min-h-[460px] overflow-hidden p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgb(34_211_238/0.2),transparent_28rem),linear-gradient(145deg,rgb(7_25_48/0.72),rgb(2_8_23/0.32))]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgb(186_230_253/0.12),transparent)]" />
      <div className="absolute inset-x-0 top-8 h-20 opacity-70 blur-sm [clip-path:polygon(0_64%,10%_42%,20%_56%,32%_24%,44%_50%,55%_22%,70%_54%,84%_30%,100%_58%,100%_100%,0_100%)] bg-cyan-100/20" />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/70">
            District map preview
          </p>
          <p className="font-display text-lg font-bold text-white">
            Almaty AQI heat map
          </p>
        </div>
        <Badge className="border-cyan-200/20 bg-cyan-200/10 text-cyan-100">
          Wind overlay
        </Badge>
      </div>

      <div className="relative z-10 mt-6 rounded-[1.75rem] border border-white/10 bg-slate-950/20 p-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-xl">
        <svg viewBox="-20 20 580 500" className="h-[320px] w-full md:h-[360px]" role="img" aria-label="Almaty district AQI map">
          <defs>
            <filter id="districtGlow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="windLines" x1="0" x2="1">
              <stop offset="0%" stopColor="rgba(34,211,238,0)" />
              <stop offset="50%" stopColor="rgba(186,230,253,0.45)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0)" />
            </linearGradient>
          </defs>
          {[110, 180, 250, 320, 390].map((y, index) => (
            <path
              key={y}
              d={`M${-10 + index * 12} ${y} C 120 ${y - 38}, 270 ${y + 38}, 548 ${y - 12}`}
              fill="none"
              stroke="url(#windLines)"
              strokeWidth="2"
              strokeLinecap="round"
              className="map-wind-line"
            />
          ))}
          <g className="translate-x-2">
            {districts.map((district) => {
              const active = selectedDistrict.name === district.name
              return (
                <g
                  key={district.name}
                  role="button"
                  tabIndex="0"
                  onClick={() => setSelectedDistrict(district)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") setSelectedDistrict(district)
                  }}
                  className="district-shape cursor-pointer outline-none"
                  filter={active ? "url(#districtGlow)" : undefined}
                >
                  <path
                    d={district.path}
                    fill={district.color}
                    fillOpacity={active ? "0.72" : "0.5"}
                    stroke={active ? "#e0f2fe" : "rgba(255,255,255,0.64)"}
                    strokeWidth={active ? "3" : "1.6"}
                  />
                  <text
                    x={district.label[0]}
                    y={district.label[1]}
                    textAnchor="middle"
                    className="pointer-events-none fill-white font-semibold"
                    fontSize="16"
                  >
                    {district.name}
                  </text>
                  <text
                    x={district.label[0]}
                    y={district.label[1] + 21}
                    textAnchor="middle"
                    className="pointer-events-none fill-cyan-50 font-mono font-bold"
                    fontSize="14"
                  >
                    {district.aqi}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      <div className="absolute bottom-5 left-5 right-5 z-10 rounded-2xl border border-white/15 bg-slate-950/35 p-4 text-white backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">{selectedDistrict.name}</p>
            <p className="text-xs text-cyan-100/70">
              PM2.5 {selectedDistrict.pm25} ug/m3
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-bold">{selectedDistrict.aqi}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">
              AQI
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

function ForecastChart() {
  const points = [42, 58, 74, 89, 76, 62]
  const polyline = points.map((value, index) => `${index * 58},${120 - value}`).join(" ")
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <svg viewBox="0 0 290 130" className="h-36 w-full">
        <defs>
          <linearGradient id="forecastGlow" x1="0" x2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="55%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>
        {[20, 50, 80, 110].map((y) => (
          <line key={y} x1="0" x2="290" y1={y} y2={y} stroke="rgba(255,255,255,.12)" />
        ))}
        <polyline
          points={polyline}
          fill="none"
          stroke="url(#forecastGlow)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((value, index) => (
          <circle
            key={`${value}-${index}`}
            cx={index * 58}
            cy={120 - value}
            r="5"
            fill="#e0f2fe"
          />
        ))}
      </svg>
    </div>
  )
}

function AppShowcase() {
  const screens = [
    ["Live AQI", "74", "Moderate", CloudSun],
    ["Map", "5", "districts", Map],
    ["Forecast", "24h", "trend", TrendingUp],
    ["AI", "smart", "advice", Bot],
  ]
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {screens.map(([title, value, label, Icon], index) => (
        <Reveal key={title} delay={index * 0.06}>
          <GlassCard className="floating min-h-72 p-5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/15 text-accent">
              <Icon size={22} />
            </div>
            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/10 p-5 text-center">
              <p className="text-sm text-text-secondary">{title}</p>
              <p className="mt-3 font-display text-4xl font-bold text-cyan-100">
                {value}
              </p>
              <p className="mt-1 text-sm text-lime-200">{label}</p>
            </div>
          </GlassCard>
        </Reveal>
      ))}
    </div>
  )
}

function LearnCard({ icon: Icon, title, text }) {
  return (
    <GlassCard className="p-6 transition-all duration-300 hover:-translate-y-1">
      <Icon className="mb-5 text-accent" size={24} />
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-text-secondary">{text}</p>
    </GlassCard>
  )
}

function NewsCard({ item }) {
  return (
    <GlassCard className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgb(34_211_238/0.16)]">
      <Badge className="mb-5 border-white/10 bg-white/10 text-text-secondary">
        {item.tag}
      </Badge>
      <h3 className="font-display text-xl font-bold">{item.title}</h3>
      <p className="mt-3 text-sm leading-7 text-text-secondary">{item.text}</p>
    </GlassCard>
  )
}

function ImpactCard({ group, status, tone }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4">
      <span className="text-sm text-text-secondary">{group}</span>
      <span className={cn("text-sm font-semibold", tone)}>{status}</span>
    </div>
  )
}

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState(navItems[0].id)
  const [selectedDistrict, setSelectedDistrict] = useState(districts[0])
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActiveSection(visible.target.id)
      },
      { threshold: [0.24, 0.42, 0.6] },
    )

    navItems.forEach((item) => {
      const section = document.getElementById(item.id)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const authTarget = isAuthenticated ? "/profile" : "/login"
  const authLabel = isAuthenticated ? "Profile" : "Login"
  const AuthIcon = isAuthenticated ? User : ArrowRight

  const currentMetrics = useMemo(
    () => [
      ["PM2.5", selectedDistrict.pm25, "ug/m3", Wind],
      ["PM10", 48, "ug/m3", RadioTower],
      ["Wind", 13, "km/h", Wind],
      ["Humidity", 45, "%", Droplets],
    ],
    [selectedDistrict],
  )

  return (
    <div className="premium-shell min-h-screen text-text-primary">
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto mt-4 flex min-h-16 max-w-[1500px] items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 shadow-lg backdrop-blur-2xl dark:bg-slate-900/25">
          <a
            href="#air-quality"
            onClick={(event) => scrollToSection(event, "air-quality")}
            className="flex shrink-0 items-center gap-3"
          >
            <AnimatedLogo />
            <div>
              <p className="font-display text-base font-bold leading-tight">
                AirQ Almaty
              </p>
              <p className="hidden text-xs text-text-secondary sm:block">
                Environmental Intelligence Platform
              </p>
            </div>
          </a>

          <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => scrollToSection(event, item.id)}
                className={cn(
                  "relative rounded-xl px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary",
                  activeSection === item.id && "text-text-primary",
                )}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span
                    layoutId="landing-nav-indicator"
                    className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-accent"
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Button asChild variant="secondary" className="hidden sm:inline-flex">
              <Link to="/chat">
                <Bot size={16} />
                AI Assistant
              </Link>
            </Button>
            <Link
              to="/chat"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-text-primary transition-colors hover:bg-white/15 sm:hidden"
              aria-label="AI Assistant"
            >
              <Bot size={17} />
            </Link>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link to={authTarget}>
                <AuthIcon size={16} />
                {authLabel}
              </Link>
            </Button>
            <Link
              to={authTarget}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-text-primary transition-colors hover:bg-white/15 sm:hidden"
              aria-label={authLabel}
            >
              <AuthIcon size={17} />
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-text-primary transition-colors hover:bg-white/15"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="air-quality" className="relative min-h-screen overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <AtmosphericBackground />
          <div className="relative z-10 mx-auto grid min-h-[calc(100vh-8rem)] max-w-[1500px] items-center gap-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(540px,1fr)]">
            <Reveal>
              <Badge className="mb-5 border-cyan-200/30 bg-cyan-200/15 text-cyan-700 dark:text-cyan-100">
                <Sparkles size={14} />
                Real-time maps, forecasts, and AI guidance
              </Badge>
              <div className="mb-7 flex items-center gap-5">
                <HeroBrandMark />
                <div>
                  <p className="font-display text-4xl font-bold leading-none md:text-5xl">
                    AirQ Almaty
                  </p>
                  <p className="mt-2 max-w-lg text-sm font-medium text-cyan-100/85 md:text-base">
                    AI-powered air quality monitoring for Almaty
                  </p>
                </div>
              </div>
              <h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.98] md:text-7xl">
                Breathe smarter with AI-powered air quality insights.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
                Track live AQI, PM2.5, pollution forecasts, wind conditions,
                and health impact across Almaty districts.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary">
                AirQ Almaty monitors, visualizes, and predicts air quality using
                real-time data, district maps, and AI recommendations.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="shadow-[0_0_34px_rgb(34_211_238/0.28)]">
                  <Link to="/map">
                    View Live Map <ChevronRight size={18} />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link to="/dashboard">
                    Explore Dashboard <TrendingUp size={18} />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link to="/chat">
                    Ask AI Assistant <Bot size={18} />
                  </Link>
                </Button>
              </div>
              <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {currentMetrics.map(([label, value, unit, Icon]) => (
                  <GlassCard key={label} className="p-4">
                    <Icon size={17} className="mb-3 text-accent" />
                    <p className="text-xs text-text-secondary">{label}</p>
                    <p className="mt-1 font-mono text-xl font-bold">
                      {value}
                      <span className="ml-1 text-xs text-text-secondary">{unit}</span>
                    </p>
                  </GlassCard>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.12} className="grid gap-4">
              <AQICard selectedDistrict={selectedDistrict} />
              <AlmatyMapPreview
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
              />
            </Reveal>
          </div>
        </section>

        <section id="data" className="px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Data intelligence"
            title="Pollutants, districts, and AI context in one operating layer."
            text="Live-style environmental metrics are presented as a clean product surface, with clear pollutant widgets and district comparison."
          />
          <div className="mx-auto grid max-w-[1500px] gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {pollutants.map((item) => (
                <PollutantCard key={item.label} item={item} />
              ))}
            </div>
            <GlassCard className="p-6">
              <BrainCircuit className="mb-4 text-accent" size={26} />
              <h3 className="font-display text-2xl font-bold">AI insight</h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                AQI is expected to worsen in the evening because low wind speed
                can reduce dispersion and increase traffic-related PM2.5 near
                central districts.
              </p>
              <div className="mt-6 space-y-3">
                {districts.map((district) => (
                  <div
                    key={district.name}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm"
                  >
                    <span>{district.name}</span>
                    <span className="font-mono font-bold text-lime-200">
                      {district.aqi}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </section>

        <section id="historical-pm25" className="px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Historical PM2.5"
            title="Pollution playback across time, seasons, and districts."
            text="Historical analysis helps reveal recurring pollution patterns and compare how air quality changes over the day and across seasons."
          />
          <div className="mx-auto grid max-w-[1500px] gap-5 lg:grid-cols-[1fr_0.75fr]">
            <GlassCard className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-2xl font-bold">PM2.5 trend</h3>
                <Badge className="border-white/10 bg-white/10 text-text-secondary">
                  <CalendarDays size={14} />
                  24h playback
                </Badge>
              </div>
              <ForecastChart />
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-xs text-text-secondary">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
                <div className="h-3 rounded-full bg-white/10">
                  <div className="h-3 w-2/3 rounded-full bg-gradient-to-r from-lime-300 via-cyan-300 to-orange-300 shadow-[0_0_24px_rgb(34_211_238/0.28)]" />
                </div>
              </div>
            </GlassCard>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {["Winter inversion", "Spring wind relief", "Summer dust", "Autumn traffic peaks"].map((label) => (
                <GlassCard key={label} className="p-5">
                  <p className="font-semibold">{label}</p>
                  <p className="mt-2 text-sm text-text-secondary">
                    Seasonality signal detected in historical PM2.5 movement.
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <section id="air-quality-app" className="px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Air Quality App"
            title="A mobile-first experience for AQI, map, forecast, and AI recommendations."
            text="Designed as a companion product: glanceable AQI, map layers, forecast cards, and personalized recommendations."
          />
          <div className="mx-auto max-w-[1500px]">
            <AppShowcase />
          </div>
        </section>

        <section id="learn" className="px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Learn"
            title="Understand the air you breathe."
            text="Clear educational cards explain pollutants and AQI without overwhelming the user."
          />
          <div className="mx-auto grid max-w-[1500px] gap-5 md:grid-cols-3">
            <LearnCard
              icon={Wind}
              title="What is PM2.5?"
              text="Tiny particles that can enter the lungs and bloodstream. PM2.5 is one of the most important health-related air-quality indicators."
            />
            <LearnCard
              icon={TrendingUp}
              title="AQI scale"
              text="AQI converts pollutant concentration into a simple health category from Good to Hazardous."
            />
            <LearnCard
              icon={Leaf}
              title="Pollutants"
              text="NO2, SO2, CO, O3, PM10, and PM2.5 each describe a different environmental and health signal."
            />
          </div>
        </section>

        <section id="news" className="px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="News"
            title="Environmental updates, alerts, and pollution context."
          />
          <div className="mx-auto grid max-w-[1500px] gap-5 md:grid-cols-3">
            {newsCards.map((item) => (
              <NewsCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <section id="impact" className="px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Impact"
            title="Health guidance for sensitive groups and daily decisions."
          />
          <div className="mx-auto grid max-w-[1500px] gap-5 lg:grid-cols-[0.9fr_1fr]">
            <GlassCard className="p-7">
              <HeartPulse className="mb-5 text-lime-200" size={30} />
              <h3 className="font-display text-2xl font-bold">Sensitive groups</h3>
              <div className="mt-6 space-y-3">
                {impactGroups.map(([group, status, tone]) => (
                  <ImpactCard key={group} group={group} status={status} tone={tone} />
                ))}
              </div>
            </GlassCard>
            <GlassCard className="p-7">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-lime-200/20 bg-lime-200/10 p-6">
                  <ShieldCheck className="mb-4 text-lime-200" size={26} />
                  <p className="font-display text-2xl font-bold">Clean air</p>
                  <p className="mt-3 text-sm text-text-secondary">
                    Better visibility, lower exposure, easier outdoor activity.
                  </p>
                </div>
                <div className="rounded-3xl border border-orange-200/20 bg-orange-200/10 p-6">
                  <Bell className="mb-4 text-orange-200" size={26} />
                  <p className="font-display text-2xl font-bold">Polluted air</p>
                  <p className="mt-3 text-sm text-text-secondary">
                    Higher risk for respiratory symptoms and outdoor fatigue.
                  </p>
                </div>
              </div>
              <Button asChild className="mt-6">
                <Link to="/dashboard">
                  View recommendations <ArrowRight size={16} />
                </Link>
              </Button>
            </GlassCard>
          </div>
        </section>
      </main>
    </div>
  )
}
