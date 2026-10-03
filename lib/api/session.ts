import type { ApiUser } from "@/lib/schemas/auth.schema"

const TOKEN_KEY = "reelora-crm-token"
const USER_KEY = "reelora-crm-user"

export type SessionUser = {
  id: string
  name: string
  email: string
  phone: string
  role: ApiUser["role"]
  phoneVerified: boolean
  emailVerified: boolean
}

export function getAccessToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function saveAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function readSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as SessionUser
    if (!parsed || parsed.role !== "admin" || typeof parsed.id !== "string" || typeof parsed.name !== "string") {
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
      return null
    }
    return {
      id: parsed.id,
      name: parsed.name,
      email: typeof parsed.email === "string" ? parsed.email : "",
      phone: typeof parsed.phone === "string" ? parsed.phone : "",
      role: "admin",
      phoneVerified: parsed.phoneVerified === true,
      emailVerified: parsed.emailVerified === true,
    }
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function saveSessionUser(user: SessionUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  window.dispatchEvent(new Event("reelora-crm:session-cleared"))
}

export function toSessionUser(user: ApiUser): SessionUser {
  return {
    id: user._id,
    name: user.fullName,
    email: user.email ?? "",
    phone: user.phone ?? "",
    role: user.role,
    phoneVerified: user.isPhoneVerified,
    emailVerified: user.isEmailVerified,
  }
}
