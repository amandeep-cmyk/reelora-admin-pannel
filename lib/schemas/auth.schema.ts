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

export const loginSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
})

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email."),
})

export const resetPasswordSchema = z.object({
  email: z.email("Enter a valid email."),
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be 100 characters or less.")
    .regex(/[A-Z]/, "Include an uppercase letter.")
    .regex(/[a-z]/, "Include a lowercase letter.")
    .regex(/\d/, "Include a number.")
    .regex(/[@$!%*?&]/, "Include one of @$!%*?&."),
})

export const otpSentSchema = successSchema(
  z.object({
    expiresInSeconds: z.number(),
    otp: z.string().optional(),
  })
)

export const authSessionSchema = successSchema(
  z.object({
    token: z.string(),
    user: userSchema,
  })
)

export const meResponseSchema = successSchema(userSchema)

export const doneSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.unknown().nullable().optional(),
})

export type ApiUser = z.infer<typeof userSchema>
export type LoginInput = z.input<typeof loginSchema>
