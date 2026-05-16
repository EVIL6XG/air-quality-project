import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BrainCircuit,
  Leaf,
  Home,
  MapPinned,
  Radar,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Target,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/Button"

const infoContent = {
  "our-mission": {
    title: "Our mission",
    text: "AirQ helps residents understand air quality in Almaty through clear data, forecasts, and practical environmental guidance.",
  },
  "why-almaty": {
    title: "Why Almaty",
    text: "Almaty is strongly affected by mountain geography, traffic, seasonal inversions, and district-level pollution differences.",
  },
  "how-airq-works": {
    title: "How AirQ works",
    text: "The platform combines historical PM2.5 data, AQI calculations, forecasting models, maps, and AI-based explanations.",
  },
  "aqi-and-pm25": {
    title: "AQI and PM2.5",
    text: "AQI summarizes air quality into a readable scale, while PM2.5 measures fine particles that can affect respiratory health.",
  },
  "forecasting-model": {
    title: "Forecasting model",
    text: "AirQ uses district-level machine learning models trained on time-based features, lag values, and rolling PM2.5 statistics.",
  },
  "latest-updates": {
    title: "Latest updates",
    text: "This section is designed for recent changes in air quality, pollution trends, and platform updates.",
  },
  "air-quality-alerts": {
    title: "Air quality alerts",
    text: "Alerts help users notice periods when pollution may increase and outdoor activity should be planned more carefully.",
  },
  "city-reports": {
    title: "City reports",
    text: "City reports can summarize district-level air quality patterns and changes across Almaty.",
  },
  "research-notes": {
    title: "Research notes",
    text: "Research notes explain technical and environmental findings behind the platform.",
  },
  "what-is-aqi": {
    title: "What is AQI?",
    text: "AQI is an index that converts pollutant concentrations into a simple health-related air quality category.",
  },
  "pm25-explained": {
    title: "PM2.5 explained",
    text: "PM2.5 refers to fine particulate matter with a diameter of 2.5 micrometers or less.",
  },
  "health-recommendations": {
    title: "Health recommendations",
    text: "AirQ recommendations help residents reduce exposure during periods of increased pollution.",
  },
  "how-forecasts-work": {
    title: "How forecasts work",
    text: "Forecasts are generated from historical patterns and recent PM2.5 behavior for each district.",
  },
  "public-health": {
    title: "Public health",
    text: "Air quality affects daily health decisions, especially for children, elderly people, and people with respiratory conditions.",
  },
  "sensitive-groups": {
    title: "Sensitive groups",
    text: "Sensitive groups may need to reduce outdoor activity when AQI or PM2.5 levels increase.",
  },
  "school-safety": {
    title: "School safety",
    text: "AirQ can support safer planning for school outdoor activities during polluted periods.",
  },
  "urban-environment": {
    title: "Urban environment",
    text: "District-level air quality data helps understand how traffic, geography, and urban density affect pollution.",
  },
  "help-center": {
    title: "Help center",
    text: "The help center provides guidance on using AirQ features, forecasts, maps, and account tools.",
  },
  "contact-airq": {
    title: "Contact AirQ",
    text: "Users and partners can contact the AirQ team for support, collaboration, or feedback.",
  },
  "report-an-issue": {
    title: "Report an issue",
    text: "This section can be used to report data, interface, or account-related issues.",
  },
  partnerships: {
    title: "Partnerships",
    text: "AirQ can be extended through partnerships with researchers, schools, environmental groups, and city services.",
  },
  "air-monitors": {
    title: "Air monitors",
    text: "This section can later include air monitoring devices and sensor recommendations.",
  },
  "clean-air-essentials": {
    title: "Clean-air essentials",
    text: "Clean-air essentials may include masks, filters, and practical tools for reducing exposure.",
  },
  "filter-guides": {
    title: "Filter guides",
    text: "Filter guides can help users understand air purifier and ventilation filter options.",
  },
  "shop-coming-soon": {
    title: "Coming soon",
    text: "The shop section is reserved for future AirQ tools and clean-air recommendations.",
  },
}

const missionValues = [
  {
    title: "Protect health",
    text: "Help people avoid unnecessary exposure to air pollution.",
    icon: Target,
  },
  {
    title: "Empower decisions",
    text: "Deliver insights that make daily choices safer and smarter.",
    icon: Leaf,
  },
  {
    title: "Stronger together",
    text: "Work with communities, experts, and partners for cleaner air.",
    icon: Users,
  },
]

const missionFeatures = [
  ["Historical data base", "Built from PM2.5 and AQI records stored by date and district.", Radar],
  ["District analysis", "Compare Bostandyk, Medeu, Auezov, Alatau, and Jetisu patterns.", MapPinned],
  ["ML forecasting", "Predict PM2.5 using lag values, rolling statistics, and seasonality features.", BrainCircuit],
  ["AI explanations", "Chat-based guidance helps users understand trends and air quality changes.", Smartphone],
]

function MissionPage() {
  return (
    <main className="airq-mission-page text-white">
      <div className="airq-mission-bg" aria-hidden="true" />

      <section className="airq-mission-hero">
        <Link to="/" className="airq-info-back airq-mission-back" aria-label="Back to home">
          <Home size={18} />
        </Link>

        <div className="mission-reference-grid">
          <motion.div
            className="airq-mission-hero-copy"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="airq-info-kicker">Mission</p>
            <h1>
              Our mission is <span>clear air, healthy communities.</span>
            </h1>
            <p>
              AirQ transforms complex environmental data into clear, timely, and
              human-centered air quality intelligence. We empower people and
              communities with knowledge to make healthier decisions, every day.
            </p>
          </motion.div>

          <motion.div
            className="mission-drivers"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            <p>What drives us</p>
            <div className="mission-driver-grid">
              {missionValues.map(({ title, text, icon: Icon }) => (
                <article key={title}>
                  <div className="mission-driver-icon">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3>{title}</h3>
                    <span>{text}</span>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="airq-mission-visual mission-impact-panel"
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.12 }}
            aria-hidden="true"
          >
            <div className="mission-product-header">
              <div>
                <span>PM2.5 forecast preview</span>
                <strong>District air intelligence</strong>
              </div>
              <em>Historical + ML</em>
            </div>

            <div className="mission-impact-chart">
              <div className="mission-impact-score">
                <span>Bostandyk</span>
                <small>Current AQI</small>
                <strong>42</strong>
                <em>Good</em>
              </div>
              <div className="mission-chart-preview">
                <div className="mission-chart-caption">
                  <span>PM2.5 trend</span>
                  <small>last records + next forecast</small>
                </div>
                <svg viewBox="0 0 420 170" role="img" aria-label="PM2.5 trend and forecast preview">
                  <g className="mission-chart-grid">
                    <path d="M30 20H400M30 55H400M30 90H400M30 125H400" />
                    <path d="M90 18V135M190 18V135M290 18V135M390 18V135" />
                  </g>
                  <path
                    className="mission-impact-line mission-impact-line-history"
                    d="M40 118 C82 106, 116 78, 150 86 S218 58, 254 48"
                  />
                  <path
                    className="mission-impact-line mission-impact-line-forecast"
                    d="M254 48 C294 54, 324 82, 350 96 S384 110, 400 104"
                  />
                  {[40, 98, 150, 218, 254, 304, 350, 400].map((x, index) => (
                    <circle
                      key={x}
                      cx={x}
                      cy={[118, 92, 86, 61, 48, 66, 96, 104][index]}
                      r="4"
                    />
                  ))}
                </svg>
                <div className="mission-chart-legend">
                  <span><i /> Historical PM2.5</span>
                  <span><i /> Forecast</span>
                </div>
              </div>
            </div>

            <div className="mission-sensor-row">
              {[
                ["PM2.5", "18", "ug/m3"],
                ["PM10", "32", "ug/m3"],
                ["O3", "41", "ppb"],
                ["NO2", "16", "ppb"],
                ["SO2", "5", "ppb"],
                ["Temp.", "18C", ""],
                ["Wind", "12", "km/h"],
              ].map(([label, value, unit]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <small>{unit}</small>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="mission-feature-list"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.28 }}
          >
            {missionFeatures.map(([title, text, Icon]) => (
              <article key={title}>
                <div>
                  <Icon size={20} />
                </div>
                <section>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </section>
              </article>
            ))}
          </motion.div>

        </div>
      </section>

      <section className="airq-mission-section airq-mission-statement">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
        >
          <p className="airq-info-kicker">Why it matters</p>
          <h2>Clean-air decisions should not require technical expertise.</h2>
          <p>
            Many residents only notice pollution when the city is already hazy.
            Our mission is to make risk visible earlier: by district, by time,
            and by practical recommendation. AirQ gives people a calmer way to
            understand when to walk, commute, ventilate, exercise, or protect
            sensitive family members.
          </p>
        </motion.div>
      </section>

      <section className="airq-mission-section">
        <div className="airq-mission-values">
          {missionValues.map(({ title, text, icon: Icon }, index) => (
            <motion.article
              className="airq-mission-card"
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div className="airq-mission-icon">
                <Icon size={24} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="airq-mission-section airq-mission-tech">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
        >
          <p className="airq-info-kicker">Platform direction</p>
          <h2>Data intelligence for a healthier urban future.</h2>
          <p>
            AirQ combines historical records, live AQI updates, PM2.5 patterns,
            district maps, and forecasting models so citizens can move from
            reacting to pollution toward anticipating it.
          </p>
        </motion.div>
        <motion.div
          className="airq-mission-signal"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
          aria-hidden="true"
        >
          <div className="signal-bars">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="signal-status">
            <ShieldCheck size={20} />
            Citizen-first environmental AI
          </div>
        </motion.div>
      </section>

      <section className="airq-mission-cta">
        <Sparkles size={26} />
        <h2>Our goal is simple: help Almaty breathe with awareness.</h2>
        <Button asChild size="lg" className="airq-mission-primary">
          <Link to="/learn">
            Learn about air quality <Leaf size={18} />
          </Link>
        </Button>
      </section>
    </main>
  )
}

export default function InfoPage() {
  const { slug } = useParams()
  const content = infoContent[slug] ?? {
    title: "AirQ",
    text: "This AirQ page is being prepared.",
  }

  if (slug === "our-mission") {
    return <MissionPage />
  }

  return (
    <main className="airq-info-page min-h-screen text-white">
      <div className="airq-info-bg" />
      <section className="airq-info-card">
        <Link to="/" className="airq-info-back">
          <ArrowLeft size={17} />
          Back to home
        </Link>
        <p className="airq-info-kicker">AirQ</p>
        <h1>{content.title}</h1>
        <p>{content.text}</p>
      </section>
    </main>
  )
}
