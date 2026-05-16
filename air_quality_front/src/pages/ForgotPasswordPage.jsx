import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Mail } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { useForgotPassword } from "@/features/auth/queries"

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [devResetUrl, setDevResetUrl] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setMessage("")
    setDevResetUrl("")

    try {
      const data = await forgotPassword.mutateAsync({ email })
      setMessage("If this email exists, account recovery instructions have been sent.")
      if (data.dev_reset_url) setDevResetUrl(data.dev_reset_url)
    } catch (err) {
      setError(err?.response?.data?.error || "Could not send recovery email")
    }
  }

  return (
    <main className="premium-shell relative min-h-screen overflow-hidden px-4 py-8 text-text-primary">
      <div className="hero-atmosphere" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-lg backdrop-blur-2xl sm:p-10"
        >
          <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
            <ArrowLeft size={16} />
            Back to login
          </Link>

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
            Account recovery
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold">Forgot password?</h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Enter your email address and AirQ will send a password recovery link.
          </p>

          <label className="mt-8 block">
            <span className="mb-2 block text-sm font-medium text-text-secondary">
              Email
            </span>
            <span className="flex h-12 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 backdrop-blur-xl transition-colors focus-within:border-accent/60">
              <Mail size={17} className="text-accent" />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                type="email"
                className="w-full bg-transparent text-sm outline-none placeholder:text-text-secondary"
              />
            </span>
          </label>

          {message && (
            <p className="mt-4 rounded-2xl border border-lime-300/20 bg-lime-400/10 px-4 py-3 text-sm text-lime-100">
              {message}
            </p>
          )}

          {devResetUrl && (
            <p className="mt-3 break-words rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
              Local development reset link: <Link className="underline" to={devResetUrl.replace(window.location.origin, "")}>{devResetUrl}</Link>
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={forgotPassword.isPending}
            className="mt-6 h-12 w-full rounded-2xl"
          >
            {forgotPassword.isPending ? "Sending..." : "Send recovery email"}
          </Button>
        </form>
      </div>
    </main>
  )
}
