import { useMemo, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Lock } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { useResetPassword } from "@/features/auth/queries"

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resetPassword = useResetPassword()
  const token = useMemo(() => searchParams.get("token") || "", [searchParams])
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")

    try {
      await resetPassword.mutateAsync({ token, password })
      navigate("/login")
    } catch (err) {
      setError(err?.response?.data?.error || "Could not reset password")
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
            New password
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold">Reset password</h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Create a new password for your AirQ account.
          </p>

          <label className="mt-8 block">
            <span className="mb-2 block text-sm font-medium text-text-secondary">
              New password
            </span>
            <span className="flex h-12 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 backdrop-blur-xl transition-colors focus-within:border-accent/60">
              <Lock size={17} className="text-accent" />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create new password"
                type="password"
                className="w-full bg-transparent text-sm outline-none placeholder:text-text-secondary"
              />
            </span>
          </label>

          {!token && (
            <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              Reset token is missing. Request a new recovery email.
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={resetPassword.isPending || !token}
            className="mt-6 h-12 w-full rounded-2xl"
          >
            {resetPassword.isPending ? "Saving..." : "Save new password"}
          </Button>
        </form>
      </div>
    </main>
  )
}
