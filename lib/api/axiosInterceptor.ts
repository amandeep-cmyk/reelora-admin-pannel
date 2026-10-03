import axios, { type InternalAxiosRequestConfig } from "axios"
import { toast } from "sonner"
import { clearSession, getAccessToken } from "@/lib/api/session"

declare module "axios" {
  interface AxiosRequestConfig {
    skipErrorToast?: boolean
  }
}

type ResponseSchema<T> = {
  safeParse: (data: unknown) => { success: boolean; data?: T }
}

export const api = axios.create({
  baseURL: "",
})

function authorizationHeader(config: InternalAxiosRequestConfig) {
  const value = config.headers.get("Authorization")
  return typeof value === "string" ? value : ""
}

function usedStoredAccessToken(config: InternalAxiosRequestConfig) {
  const stored = getAccessToken()
  if (!stored) return false
  return authorizationHeader(config) === `Bearer ${stored}`
}

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (data && typeof data === "object") {
      const body = data as { message?: unknown; errors?: unknown }
      if (Array.isArray(body.errors)) {
        const lines = body.errors.filter((item) => typeof item === "string")
        if (lines.length > 0) return lines.join(" ")
      }
      if (typeof body.message === "string" && body.message.trim()) return body.message
    }
    if (!error.response) return "Cannot reach the server. Check that the API is running."
    if (error.response.status === 429) return "Please wait a moment and try again."
  }
  return "Something went wrong. Please try again."
}

export function parseResponse<T>(schema: ResponseSchema<T>, payload: unknown): T {
  const result = schema.safeParse(payload)
  if (!result.success || result.data === undefined) {
    if (typeof window !== "undefined") toast.error("The server sent an unexpected response.")
    throw new Error("Unexpected response")
  }
  return result.data
}

api.interceptors.request.use((config) => {
  const existing = authorizationHeader(config)
  if (!existing) {
    const token = getAccessToken()
    if (token) config.headers.set("Authorization", `Bearer ${token}`)
  }
  if (config.data !== undefined && !config.headers.get("Content-Type")) {
    config.headers.set("Content-Type", "application/json")
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const config = error.config
      if (error.response?.status === 401 && config && usedStoredAccessToken(config)) {
        clearSession()
      }
      if (typeof window !== "undefined" && !config?.skipErrorToast) {
        toast.error(getErrorMessage(error))
      }
    }
    return Promise.reject(error)
  }
)
