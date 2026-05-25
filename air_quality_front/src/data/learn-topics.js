import {
  Activity,
  Factory,
  HeartPulse,
  ShieldCheck,
  Waves,
  Wind,
} from "lucide-react"

export const learnTopics = [
  {
    slug: "what-is-aqi",
    title: "What is AQI?",
    summary: "Understand how AQI converts pollutant measurements into clear health categories.",
    icon: Activity,
    readTime: "6 min read",
    sections: [
      {
        heading: "AQI as a Public Health Indicator",
        text: "The Air Quality Index (AQI) is a standardized communication model that converts pollutant concentrations into a single interpretable scale. Instead of presenting technical concentration units to non-specialist users, AQI translates environmental measurements into health-oriented categories such as good, moderate, or unhealthy. In practice, this allows citizens, schools, and municipal services to make fast exposure decisions without requiring atmospheric chemistry expertise.",
      },
      {
        heading: "How AQI Scores Are Interpreted",
        text: "Lower AQI values correspond to cleaner ambient air and reduced short-term risk. As AQI rises, potential health effects increase first for sensitive groups and later for the general population. In an urban context such as Almaty, AQI interpretation is especially relevant during winter inversion periods and traffic peaks, when local concentrations can change rapidly within a single day.",
      },
      {
        heading: "Daily Decision Support",
        text: "For end users, AQI supports practical choices: whether to schedule outdoor activity, when to ventilate indoor spaces, and when to reduce prolonged exposure near transport corridors. Within AirQ, AQI is therefore not only a visualization metric but a behavioral guidance layer that connects environmental sensing to personal and community health actions.",
      },
    ],
  },
  {
    slug: "pm25-explained",
    title: "PM2.5 Explained",
    summary: "Learn why fine particulate matter is one of the most important pollution indicators.",
    icon: Wind,
    readTime: "7 min read",
    sections: [
      {
        heading: "Physical Meaning of PM2.5",
        text: "PM2.5 represents particulate matter with aerodynamic diameter up to 2.5 micrometers. Because these particles are extremely small, they remain suspended in air and can travel deeply into the respiratory tract. Their size profile makes them more clinically significant than larger coarse particles in many urban exposure studies.",
      },
      {
        heading: "Primary Urban Sources",
        text: "In dense city environments, PM2.5 typically originates from transport emissions, household and district heating combustion, industrial activity, and secondary atmospheric formation. In Almaty, topographic conditions and meteorological stagnation can intensify concentration persistence, producing district-level differences that are relevant for local monitoring.",
      },
      {
        heading: "Health Relevance",
        text: "Sustained PM2.5 exposure is associated with elevated respiratory and cardiovascular risk. Short-term peaks can aggravate asthma and other chronic conditions, while long-term exposure contributes to broader public health burden. For this reason, PM2.5 is used in AirQ as a core forecasting target and a principal dashboard signal.",
      },
    ],
  },
  {
    slug: "health-recommendations",
    title: "Health Recommendations",
    summary: "Practical actions to reduce risk during moderate and high pollution periods.",
    icon: HeartPulse,
    readTime: "5 min read",
    sections: [
      {
        heading: "For normal outdoor routines",
        text: "On elevated AQI days, shorten high-intensity outdoor activity and prefer lower-traffic routes.",
      },
      {
        heading: "For sensitive groups",
        text: "Children, elderly people, and people with asthma should limit exposure earlier than others.",
      },
      {
        heading: "Indoor protection",
        text: "Keep windows closed during smog peaks and use filtration or clean ventilation strategies when possible.",
      },
    ],
  },
  {
    slug: "how-forecasting-works",
    title: "How Forecasting Works",
    summary: "How AirQ estimates near-future pollution using historical patterns and recent changes.",
    icon: Waves,
    readTime: "8 min read",
    sections: [
      {
        heading: "Data baseline",
        text: "Forecasts are trained on district-level history: PM2.5 trends, temporal features, and recent behavior.",
      },
      {
        heading: "Model behavior",
        text: "The model combines lag values and rolling statistics to estimate how pollution may evolve in the next period.",
      },
      {
        heading: "How to use forecasts",
        text: "Forecasts are decision support: useful for planning, but always interpreted together with live readings.",
      },
    ],
  },
  {
    slug: "pollution-sources",
    title: "Pollution Sources",
    summary: "A practical view of where air pollution comes from in dense urban environments.",
    icon: Factory,
    readTime: "6 min read",
    sections: [
      {
        heading: "Transport emissions",
        text: "Road traffic contributes to particulate matter and gaseous pollutants, especially during congestion peaks.",
      },
      {
        heading: "Seasonal heating",
        text: "Cold seasons often increase combustion-related pollution due to heating demand and inversion effects.",
      },
      {
        heading: "Geography and weather",
        text: "Local topography and stagnant weather can trap pollution, creating strong differences between districts.",
      },
    ],
  },
  {
    slug: "protect-during-smog",
    title: "Protect Yourself During Smog",
    summary: "A step-by-step routine for high-smog days when pollution remains elevated for hours.",
    icon: ShieldCheck,
    readTime: "5 min read",
    sections: [
      {
        heading: "Plan the day around AQI windows",
        text: "Shift outdoor tasks to cleaner periods and avoid peak traffic corridors when possible.",
      },
      {
        heading: "Use protective gear correctly",
        text: "If needed, use properly fitted filtration masks and keep exposure duration as short as practical.",
      },
      {
        heading: "Support recovery indoors",
        text: "Hydration, cleaner indoor air, and reduced exertion can help lower the body load during smog events.",
      },
    ],
  },
]

export const learnTopicsBySlug = Object.fromEntries(
  learnTopics.map((topic) => [topic.slug, topic]),
)
