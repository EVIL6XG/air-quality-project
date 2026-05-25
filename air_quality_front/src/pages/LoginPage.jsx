import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, Lock, Mail } from "lucide-react"

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
        <Link to="/" className="mx-auto mb-5 flex w-fit flex-col items-center text-center">
          <img
            src="/image (3).png"
            alt="AirQ"
            className="h-20 w-32 object-contain drop-shadow-[0_0_24px_rgb(167_139_250/0.42)]"
          />
        </Link>

        <form
          onSubmit={handleLogin}
          className="rounded-[1.6rem] border border-white/14 bg-slate-950/58 p-6 shadow-[0_28px_90px_rgb(0_0_0/0.42)] backdrop-blur-2xl sm:p-8"
        >
          <div className="mb-7 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
              Secure login
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/62">
              Continue to your AirQ dashboard.
            </p>
          </div>

          <div className="space-y-3.5">
            <label className="block">
              <span className="sr-only">Email</span>
              <span className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-4 text-white/80 shadow-inner shadow-white/5 transition-colors focus-within:border-cyan-300/60">
                <Mail size={17} className="text-cyan-200" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                />
              </span>
            </label>

            <label className="block">
              <span className="sr-only">Password</span>
              <span className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-4 text-white/80 shadow-inner shadow-white/5 transition-colors focus-within:border-cyan-300/65">
                <Lock size={17} className="text-cyan-200" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  type="password"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                />
              </span>
            </label>
          </div>

          <div className="mt-3 text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-cyan-200 transition-colors hover:text-white">
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="mt-6 h-12 w-full rounded-xl border-0 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 text-white shadow-[0_18px_42px_rgb(56_189_248/0.34)] transition-transform hover:scale-[1.01]"
          >
            {loginMutation.isPending ? "Signing in..." : "Continue"}
            <ArrowRight size={17} />
          </Button>

          <p className="mt-5 text-center text-sm text-white/58">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-cyan-200 transition-colors hover:text-white">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
