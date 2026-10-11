"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ZodError } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/providers/auth-provider"
import { getErrorMessage } from "@/lib/api/axiosInterceptor"
import { forgotPassword, login, resetPassword } from "@/lib/services/auth"

// Turns an error into a short message for the form.
function messageFrom(error: unknown) {
  if (error instanceof ZodError) return error.issues[0]?.message ?? "Check the form."
  if (error instanceof Error && error.message === "Unexpected response") {
    return "The server sent an unexpected response."
  }
  return getErrorMessage(error)
}

export function LoginForm() {
  const router = useRouter()
  const { user, ready, setSession } = useAuth()
  const [mode, setMode] = useState<"login" | "forgot" | "reset">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [devOtp, setDevOtp] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  // If already logged in as admin, go to the dashboard.
  useEffect(() => {
    if (ready && user?.role === "admin") router.replace("/dashboard")
  }, [ready, user, router])

  // Handles login, forgot-password, and reset-password submits.
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setPending(true)
    try {
      if (mode === "forgot") {
        const result = await forgotPassword(email)
        if (process.env.NODE_ENV !== "production") setDevOtp(result.data.otp ?? "")
        setMode("reset")
        return
      }
      if (mode === "reset") {
        await resetPassword({ email, otp, password })
        setMode("login")
        setPassword("")
        setOtp("")
        setError("Password reset. Log in with the new password.")
        return
      }
      const result = await login({ email, password })
      const session = setSession(result.data.token, result.data.user)
      if (!session) {
        setError("This account is not an admin.")
        return
      }
      router.push("/dashboard")
    } catch (caught) {
      setError(messageFrom(caught))
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-[440px]">
      <h1 className="text-4xl font-semibold tracking-tight text-white">Log in to your panel</h1>
      <p className="mt-3 text-sm text-white/60">Admin sign-in uses email and password.</p>

      <div className="mt-6 space-y-2">
        <Label htmlFor="email" className="font-normal text-white">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@relora.app"
          autoComplete="email"
          disabled={mode === "reset"}
        />
      </div>

      {mode !== "forgot" ? (
        <div className="mt-5 space-y-2">
          <Label htmlFor="password" className="font-normal text-white">
            {mode === "reset" ? "New password" : "Password"}
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>
      ) : null}

      {mode === "reset" ? (
        <div className="mt-5 space-y-2">
          <Label htmlFor="otp" className="font-normal text-white">
            Code
          </Label>
          <Input
            id="otp"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            placeholder="6-digit code"
            inputMode="numeric"
          />
          {process.env.NODE_ENV !== "production" && devOtp ? (
            <p className="text-sm text-white/60">Development code: {devOtp}</p>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="mt-4 text-sm text-[#E1306C]">{error}</p> : null}

      <Button type="submit" variant="gradient" size="xl" className="mt-8 w-full" disabled={pending}>
        {pending ? "Please wait…" : mode === "login" ? "Login" : mode === "forgot" ? "Send code" : "Save password"}
      </Button>

      <button
        type="button"
        className="mt-4 text-sm text-white/60"
        onClick={() => {
          setMode(mode === "login" ? "forgot" : "login")
          setError("")
          setOtp("")
        }}
      >
        {mode === "login" ? "Forgot password" : "Back to login"}
      </button>
    </form>
  )
}
