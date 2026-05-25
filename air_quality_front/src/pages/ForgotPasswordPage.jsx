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
    <main className="premium-shell relative grid min-h-screen place-items-center overflow-hidden px-4 py-8 text-white">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 18% 14%, rgb(56 189 248 / 0.2), transparent 36rem), radial-gradient(ellipse at 78% 8%, rgb(14 116 144 / 0.28), transparent 34rem), linear-gradient(160deg, #071423 0%, #0b2034 42%, #12314a 100%)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="airq-sky" />
        <div className="auth-smog auth-smog-a" />
        <div className="auth-smog auth-smog-b" />
        <div className="auth-smog auth-smog-c" />
        <div className="auth-haze" />
      </div>

      <div className="relative z-10 w-full max-w-[27rem]">
        <Link to="/" className="mx-auto mb-5 flex w-fit items-center justify-center">
          <img
            src="/image (3).png"
            alt="AirQ"
            className="h-20 w-32 object-contain drop-shadow-[0_0_24px_rgb(167_139_250/0.42)]"
          />
        </Link>

        <form
          onSubmit={handleSubmit}
          className="rounded-[1.6rem] border border-white/14 bg-slate-950/58 p-6 shadow-[0_28px_90px_rgb(0_0_0/0.42)] backdrop-blur-2xl sm:p-8"
        >
          <Link to="/login" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-white/62 transition-colors hover:text-white">
            <ArrowLeft size={16} />
            Back to login
          </Link>

          <div className="mb-7 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
              Account recovery
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/62">
              Enter your email and we will send a recovery link.
            </p>
          </div>

          <label className="block">
            <span className="sr-only">Email</span>
            <span className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-4 text-white/80 shadow-inner shadow-white/5 transition-colors focus-within:border-cyan-300/60">
              <Mail size={17} className="text-cyan-200" />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                type="email"
                className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
              />
            </span>
          </label>

          {message && (
            <p className="mt-4 rounded-xl border border-lime-300/20 bg-lime-400/10 px-4 py-3 text-sm text-lime-100">
              {message}
            </p>
          )}

          {devResetUrl && (
            <p className="mt-3 break-words rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
              Local development reset link: <Link className="underline" to={devResetUrl.replace(window.location.origin, "")}>{devResetUrl}</Link>
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={forgotPassword.isPending}
            className="mt-6 h-12 w-full rounded-xl border-0 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 text-white shadow-[0_18px_42px_rgb(56_189_248/0.34)] transition-transform hover:scale-[1.01]"
          >
            {forgotPassword.isPending ? "Sending..." : "Send recovery email"}
          </Button>
        </form>
      </div>
    </main>
  )
}
