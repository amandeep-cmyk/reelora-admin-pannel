import { api, parseResponse } from "@/lib/api/axiosInterceptor"
import { endpoints } from "@/lib/api/endpoints"
import {
  meResponseSchema,
  sendOtpResponseSchema,
  sendOtpSchema,
  verifyOtpResponseSchema,
  verifyOtpSchema,
  type SendOtpInput,
  type VerifyOtpInput,
} from "@/lib/schemas/auth.schema"

export async function sendOtp(body: SendOtpInput) {
  const parsed = sendOtpSchema.parse(body)
  const { data } = await api.post(endpoints.auth.sendOtp, parsed, { skipErrorToast: true })
  return parseResponse(sendOtpResponseSchema, data)
}

export async function verifyOtp(body: VerifyOtpInput) {
  const parsed = verifyOtpSchema.parse(body)
  const { data } = await api.post(endpoints.auth.verifyOtp, parsed, { skipErrorToast: true })
  return parseResponse(verifyOtpResponseSchema, data)
}

export async function getProfile() {
  const { data } = await api.get(endpoints.auth.me)
  return parseResponse(meResponseSchema, data)
}
