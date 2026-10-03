import { z } from "zod"
import { paginationSchema } from "@/lib/schemas/admin.schema"

export const reviewSchema = z.object({
  _id: z.string(),
  bookingId: z.string(),
  serviceId: z.string().optional(),
  direction: z.string(),
  stars: z.number(),
  comment: z.string().optional().default(""),
  createdAt: z.string(),
  reviewer: z.object({ id: z.string(), name: z.string() }),
  subject: z.object({ id: z.string(), name: z.string() }).optional(),
})

export const reviewPageSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.array(reviewSchema),
  pagination: paginationSchema,
})

export type Review = z.infer<typeof reviewSchema>
