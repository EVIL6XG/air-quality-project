import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, Bot, CloudSun, Lock, Mail, Map } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { useLogin } from "@/features/auth/queries"
import { useAuth } from "@/providers/auth-provider"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const loginMutation = useLogin()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleLogin(event) {
    event.preventDefault()
    setError("")

    try {
      const data = await loginMutation.mutateAsync({ email, password })
      login(data.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed")
    }
  }

  return (
    <main className="premium-shell relative min-h-screen overflow-hidden px-4 py-8 text-text-primary">
      <div className="hero-atmosphere" />
      <div className="particle-field" />
      <div className="cloud-layer" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-lg backdrop-blur-2xl lg:grid-cols-[0.95fr_1fr]">
          <section className="hidden min-h-[640px] flex-col justify-between border-r border-white/10 bg-slate-950/25 p-10 lg:flex">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/purple.png"
                alt="Air Q Almaty logo"
                className="h-12 w-12 object-contain drop-shadow-[0_0_22px_rgb(34_211_238/0.4)]"
              />
              <div>
                <p className="font-display text-xl font-bold">Air Q Almaty</p>
                <p className="text-sm text-text-secondary">
                  Environmental intelligence
                </p>
              </div>
            </Link>

            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                Welcome back
              </p>
              <h1 className="font-display text-5xl font-bold leading-tight">
                Monitor Almaty with Air Q Almaty.
              </h1>
              <p className="mt-5 max-w-md text-base leading-8 text-text-secondary">
                Sign in to access live AQI, district heatmaps, PM2.5 trends,
                forecasts, and AI recommendations.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                [Map, "Live map"],
                [CloudSun, "Forecast"],
                [Bot, "AI insight"],
              ].map(([Icon, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <Icon size={20} className="mb-3 text-accent" />
                  <p className="text-sm font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex items-center justify-center p-6 sm:p-10">
            <form onSubmit={handleLogin} className="w-full max-w-md">
              <div className="mb-8 text-center lg:hidden">
                <img
                  src="/purple.png"
                  alt="Air Q Almaty logo"
                  className="mx-auto h-14 w-14 object-contain"
                />
              </div>

              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                  Secure login
                </p>
                <h2 className="mt-3 font-display text-4xl font-bold">
                  Welcome back
                </h2>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  Continue to your Air Q Almaty dashboard.
                </p>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-text-secondary">
                    Email
                  </span>
                  <span className="flex h-12 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 backdrop-blur-xl transition-colors focus-within:border-accent/60">
                    <Mail size={17} className="text-accent" />
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-text-secondary"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-text-secondary">
                    Password
                  </span>
                  <span className="flex h-12 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 backdrop-blur-xl transition-colors focus-within:border-accent/60">
                    <Lock size={17} className="text-accent" />
                    <input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      type="password"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-text-secondary"
                    />
                  </span>
                </label>
              </div>

              <div className="mt-3 text-right">
                <button type="button" className="text-sm font-medium text-accent">
                  Forgot password?
                </button>
              </div>

              {error && (
                <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="mt-6 h-12 w-full rounded-2xl shadow-[0_0_34px_rgb(34_211_238/0.24)]"
              >
                {loginMutation.isPending ? "Signing in..." : "Continue"}
                <ArrowRight size={17} />
              </Button>

              <p className="mt-6 text-center text-sm text-text-secondary">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-accent">
                  Sign up
                </Link>
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
