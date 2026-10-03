"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import {
  clearSession,
  getAccessToken,
  readSessionUser,
  saveAccessToken,
  saveSessionUser,
  toSessionUser,
  type SessionUser,
} from "@/lib/api/session"
import type { ApiUser } from "@/lib/schemas/auth.schema"
import { getProfile } from "@/lib/services/auth"

export type { SessionUser }

type AuthContextValue = {
  user: SessionUser | null
  ready: boolean
  setSession: (token: string, user: ApiUser) => SessionUser | null
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [ready, setReady] = useState(false)

  const setSession = useCallback((token: string, apiUser: ApiUser) => {
    if (apiUser.role !== "admin") {
      clearSession()
      setUser(null)
      return null
    }
    const next = toSessionUser(apiUser)
    saveAccessToken(token)
    saveSessionUser(next)
    setUser(next)
    return next
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  useEffect(() => {
    function onClear() {
      setUser(null)
    }
    window.addEventListener("reelora-crm:session-cleared", onClear)

    const stored = readSessionUser()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(stored)

    if (!getAccessToken() || !stored) {
      setReady(true)
      return () => window.removeEventListener("reelora-crm:session-cleared", onClear)
    }

    getProfile()
      .then((result) => {
        if (result.data.role !== "admin") {
          clearSession()
          setUser(null)
          return
        }
        const next = toSessionUser(result.data)
        saveSessionUser(next)
        setUser(next)
      })
      .catch(() => {
        setUser(readSessionUser())
      })
      .finally(() => setReady(true))

    return () => window.removeEventListener("reelora-crm:session-cleared", onClear)
  }, [])

  return <AuthContext.Provider value={{ user, ready, setSession, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error("useAuth must be used inside AuthProvider")
  return value
}
