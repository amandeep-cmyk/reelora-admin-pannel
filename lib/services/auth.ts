import { api, parseResponse } from "@/lib/api/axiosInterceptor"
import { endpoints } from "@/lib/api/endpoints"
import {
  authSessionSchema,
  doneSchema,
  forgotPasswordSchema,
  loginSchema,
  meResponseSchema,
  otpSentSchema,
  resetPasswordSchema,
  type LoginInput,
} from "@/lib/schemas/auth.schema"

export async function login(body: LoginInput) {
  const parsed = loginSchema.parse(body)
  const { data } = await api.post(endpoints.auth.login, parsed, { skipErrorToast: true })
  return parseResponse(authSessionSchema, data)
}

export async function forgotPassword(email: string) {
  const parsed = forgotPasswordSchema.parse({ email })
  const { data } = await api.post(endpoints.auth.forgotPassword, parsed, { skipErrorToast: true })
  return parseResponse(otpSentSchema, data)
}

export async function resetPassword(body: { email: string; otp: string; password: string }) {
  const parsed = resetPasswordSchema.parse(body)
  const { data } = await api.post(endpoints.auth.resetPassword, parsed, { skipErrorToast: true })
  return parseResponse(doneSchema, data)
}

export async function getProfile() {
  const { data } = await api.get(endpoints.auth.me)
  return parseResponse(meResponseSchema, data)
}
