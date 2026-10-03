"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ZodError } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/providers/auth-provider"
import { getErrorMessage } from "@/lib/api/axiosInterceptor"
import { sendOtp, verifyOtp } from "@/lib/services/auth"

function messageFrom(error: unknown) {
  if (error instanceof ZodError) return error.issues[0]?.message ?? "Check the form."
  if (error instanceof Error && error.message === "Unexpected response") return "The server sent an unexpected response."
  return getErrorMessage(error)
}

export function LoginForm() {
  const router = useRouter()
  const { user, ready, setSession } = useAuth()
  const [channel, setChannel] = useState<"phone" | "email">("phone")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [sent, setSent] = useState(false)
  const [devOtp, setDevOtp] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (ready && user?.role === "admin") router.replace("/dashboard")
  }, [ready, user, router])

  useEffect(() => {
    if (cooldown <= 0) return
    const id = window.setTimeout(() => setCooldown((current) => current - 1), 1000)
    return () => window.clearTimeout(id)
  }, [cooldown])

  function contactBody() {
    return channel === "email" ? { email } : { phone }
  }

  async function send(event: React.FormEvent) {
    event.preventDefault()
    if (cooldown > 0) return
    setError("")
    setPending(true)
    try {
      const result = await sendOtp(contactBody())
      setSent(true)
      setDevOtp(result.data.otp)
      setCooldown(30)
    } catch (caught) {
      setError(messageFrom(caught))
    } finally {
      setPending(false)
    }
  }

  async function verify(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setPending(true)
    try {
      const result = await verifyOtp({ ...contactBody(), otp })
      if (result.data.isNewUser) {
        setError("This contact is not an admin account.")
        return
      }
      if (result.data.user.role !== "admin") {
        setError("This account is not an admin.")
        return
      }
      setSession(result.data.token, result.data.user)
      router.push("/dashboard")
    } catch (caught) {
      setError(messageFrom(caught))
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={sent ? verify : send} className="w-full max-w-[440px]">
      <h1 className="text-4xl font-semibold tracking-tight text-white">Log in to your panel</h1>
      <p className="mt-3 text-sm text-white/60">Admin sign-in uses the one-time code from the API.</p>
      <div className="mt-6 flex gap-4 text-sm">
        {(["phone", "email"] as const).map((item) => (
          <button
            key={item}
            type="button"
            className={channel === item ? "border-b border-[#E1306C] pb-1 text-white" : "pb-1 text-white/50"}
            onClick={() => {
              setChannel(item)
              setSent(false)
              setOtp("")
              setDevOtp("")
              setError("")
            }}
          >
            {item === "phone" ? "Phone" : "Email"}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-2">
        <Label htmlFor="contact" className="font-normal text-white">
          {channel === "phone" ? "Phone number" : "Email"}
        </Label>
        {channel === "phone" ? (
          <Input
            id="contact"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="9876543210"
            autoComplete="tel"
            disabled={sent}
          />
        ) : (
          <Input
            id="contact"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@relora.app"
            autoComplete="email"
            disabled={sent}
          />
        )}
      </div>
      {sent ? (
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
            autoComplete="one-time-code"
          />
          {devOtp ? (
            <p className="text-sm text-white/60">
              Code sent. Use <span className="font-medium text-white">{devOtp}</span> until delivery is connected.
            </p>
          ) : null}
        </div>
      ) : null}
      {error ? <p className="mt-4 text-sm text-[#E1306C]">{error}</p> : null}
      <Button type="submit" variant="gradient" size="xl" className="mt-8 w-full" disabled={pending}>
        {pending ? "Please wait…" : sent ? "Login" : cooldown > 0 ? `Resend in ${cooldown}s` : "Send code"}
      </Button>
      {sent ? (
        <button
          type="button"
          className="mt-4 text-sm text-white/60"
          onClick={() => {
            setSent(false)
            setOtp("")
            setError("")
          }}
        >
          Use a different contact
        </button>
      ) : null}
    </form>
  )
}
