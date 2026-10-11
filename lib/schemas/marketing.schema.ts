import { z } from "zod"
import { successSchema } from "@/lib/schemas/auth.schema"

export const bannerSchema = z.object({
  _id: z.string(),
  imageUrl: z.string().optional().default(""),
  audience: z.string(),
  placement: z.string(),
  sortOrder: z.number().optional().default(0),
  isActive: z.boolean(),
})

export const eventSchema = z.object({
  _id: z.string(),
  imageUrl: z.string().optional().default(""),
  link: z.string(),
  details: z.string(),
  startAt: z.string(),
  expiresAt: z.string(),
  isActive: z.boolean(),
})

export const featuredTalentSchema = z.object({
  _id: z.string(),
  name: z.string(),
  instagramHandle: z.string(),
  imageUrl: z.string().optional().default(""),
  sortOrder: z.number().optional().default(0),
  isActive: z.boolean(),
})

export const bannerListSchema = successSchema(z.array(bannerSchema))
export const bannerResponseSchema = successSchema(bannerSchema)
export const eventListSchema = successSchema(z.array(eventSchema))
export const eventResponseSchema = successSchema(eventSchema)
export const talentListSchema = successSchema(z.array(featuredTalentSchema))
export const talentResponseSchema = successSchema(featuredTalentSchema)
export const deletedSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.null().optional(),
})

export type Banner = z.infer<typeof bannerSchema>
export type MarketingEvent = z.infer<typeof eventSchema>
export type FeaturedTalent = z.infer<typeof featuredTalentSchema>
