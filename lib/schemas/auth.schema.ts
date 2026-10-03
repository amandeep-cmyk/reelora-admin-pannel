import { z } from "zod"

export function successSchema<T extends z.ZodType>(data: T) {
  return z.object({
    success: z.literal(true),
    message: z.string(),
    data,
  })
}

export const phoneSchema = z
  .string()
  .trim()
  .transform((value) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2)
    return digits
  })
  .refine((value) => /^[6-9]\d{9}$/.test(value), "Enter a valid 10-digit mobile number.")

export const otpSchema = z.string().regex(/^\d{6}$/, "Enter the 6-digit code.")

export const apiRoleSchema = z.enum(["user", "talent", "vendor", "admin", "team"])

export const userSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  isPhoneVerified: z.boolean(),
  isEmailVerified: z.boolean(),
  role: apiRoleSchema,
  isActive: z.boolean(),
  bannedUntil: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const sendOtpSchema = z.union([
  z.object({ phone: phoneSchema }),
  z.object({ email: z.email("Enter a valid email.") }),
])

export const verifyOtpSchema = z.union([
  z.object({ phone: phoneSchema, otp: otpSchema }),
  z.object({ email: z.email("Enter a valid email."), otp: otpSchema }),
])

export const sendOtpResponseSchema = successSchema(
  z.object({
    expiresInSeconds: z.number(),
    otp: z.string(),
  })
)

export const verifyOtpResponseSchema = successSchema(
  z.discriminatedUnion("isNewUser", [
    z.object({
      isNewUser: z.literal(false),
      token: z.string(),
      user: userSchema,
    }),
    z.object({
      isNewUser: z.literal(true),
      registrationToken: z.string(),
    }),
  ])
)

export const meResponseSchema = successSchema(userSchema)

export type ApiUser = z.infer<typeof userSchema>
export type SendOtpInput = z.input<typeof sendOtpSchema>
export type VerifyOtpInput = z.input<typeof verifyOtpSchema>
