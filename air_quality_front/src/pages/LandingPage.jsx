import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowRight,
  AtSign,
  KeyRound,
  Mail,
  Phone,
  Search,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const navMenus = {
  AirQ: [
    ["Our mission", "/info/our-mission"],
    ["Why Almaty", "/info/why-almaty"],
    ["How AirQ works", "/info/how-airq-works"],
    ["AQI and PM2.5", "/info/aqi-and-pm25"],
    ["Forecasting model", "/info/forecasting-model"],
  ],
  Learn: [
    ["What is AQI?", "/info/what-is-aqi"],
    ["PM2.5 explained", "/info/pm25-explained"],
    ["Health recommendations", "/info/health-recommendations"],
    ["How forecasts work", "/info/how-forecasts-work"],
  ],
  Impact: [
    ["Public health", "/info/public-health"],
    ["Sensitive groups", "/info/sensitive-groups"],
    ["School safety", "/info/school-safety"],
    ["Urban environment", "/info/urban-environment"],
  ],
  Shop: [
    ["AirQ store", "/shop"],
    ["Air quality products", "/shop#air-products"],
    ["Eco merchandise", "/shop#merch"],
  ],
}

function LandingHeader() {
  return (
    <header className="airq-header">
      <Link to="/" className="airq-wordmark" aria-label="AirQ home">
        AirQ
      </Link>

      <nav className="airq-nav" aria-label="Main navigation">
        <button className="airq-search" type="button" aria-label="Search">
          <Search size={17} />
        </button>
        {Object.entries(navMenus).map(([label, items]) => (
          <DropdownMenu key={label}>
            <DropdownMenuTrigger className="airq-nav-link" type="button">
              {label}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="airq-menu-content">
              <DropdownMenuLabel className="airq-menu-label">
                {label === "AirQ" ? "AirQ platform" : label}
              </DropdownMenuLabel>
              {items.map(([item, href]) => (
                <DropdownMenuItem key={item} asChild className="airq-menu-item">
                  <Link to={href}>{item}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </nav>

      <AuthDialog />
    </header>
  )
}

function AuthDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="airq-auth-button" size="sm">
          Log in
        </Button>
      </DialogTrigger>
      <DialogContent className="airq-auth-dialog">
        <DialogHeader>
          <DialogTitle>Access AirQ</DialogTitle>
          <DialogDescription>
            Log in or create an account to save districts, alerts, and forecast
            preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid gap-3">
          <Button asChild variant="secondary" className="justify-start">
            <Link to="/login">
              <AtSign size={17} />
              Continue with Google
            </Link>
          </Button>
          <Button asChild variant="secondary" className="justify-start">
            <Link to="/login">
              <Phone size={17} />
              Continue with phone number
            </Link>
          </Button>
          <Button asChild variant="secondary" className="justify-start">
            <Link to="/login">
              <Mail size={17} />
              Continue with email
            </Link>
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link to="/signup" className="font-medium text-accent hover:underline">
            Create an account
          </Link>
          <Link to="/forgot-password" className="text-text-secondary hover:text-text-primary">
            Forgot password?
          </Link>
        </div>

        <div className="mt-5 rounded-xl border border-border-subtle bg-surface-2/70 p-4">
          <div className="flex gap-3">
            <KeyRound className="mt-0.5 text-accent" size={18} />
            <div>
              <p className="text-sm font-medium">Forgot account?</p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Account recovery can be sent through your registered email
                address.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AlmatyHeroScene() {
  return (
    <div className="airq-scene" aria-hidden="true">
      <div className="airq-scene-image" />
      <div className="airq-sky" />
      <div className="airq-city-lights" />
      <div className="airq-smog airq-smog-back" />
      <div className="airq-smog airq-smog-front" />
      <div className="airq-haze-clear" />
    </div>
  )
}

function HeroContent() {
  return (
    <section id="airq" className="airq-hero">
      <AlmatyHeroScene />

      <motion.div
        className="airq-center-logo-wrap"
        initial={{ opacity: 0, x: -135, y: -40, scale: 0.64 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: 2.15, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
      >
        <span className="airq-logo-aura" />
        <img src="/image (3).png" alt="AirQ" className="airq-center-logo" />
      </motion.div>

      <motion.div
        className="airq-hero-copy"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05, ease: "easeOut", delay: 2.15 }}
      >
        <h1>Welcome to AirQ</h1>
        <p>Breathe safer. Know your city.</p>
        <div className="airq-hero-actions">
          <Button asChild size="lg">
            <Link to="/dashboard">
              Explore air quality <ArrowRight size={18} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/map">View Almaty map</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="airq-landing min-h-screen text-white">
      <LandingHeader />
      <main>
        <HeroContent />
      </main>
      <div className="airq-trust-pill" aria-hidden="true">
        <ShieldCheck size={16} />
        Almaty air intelligence
      </div>
    </div>
  )
}
