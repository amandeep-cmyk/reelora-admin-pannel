import { z } from "zod"
import { successSchema, phoneSchema } from "@/lib/schemas/auth.schema"

export const bookingStatuses = [
  "pending_payment",
  "booked",
  "paid_upfront",
  "confirmed_by_admin",
  "in_progress",
  "completed",
  "settled",
  "cancelled",
  "refunded",
] as const

export type BookingStatus = (typeof bookingStatuses)[number]

const monthCountSchema = z.object({ month: z.string(), count: z.number() })
const monthMoneySchema = monthCountSchema.extend({ totalPaise: z.number() })

export const adminDashboardSchema = z.object({
  range: z.object({ from: z.string().nullable(), to: z.string().nullable() }),
  people: z.object({
    clients: z.number(),
    talents: z.number(),
    vendors: z.number(),
    team: z.number(),
  }),
  services: z.object({
    created: z.number(),
    published: z.number(),
    byMonth: z.array(monthCountSchema),
  }),
  bookings: z.object({
    byStatus: z.array(z.object({ status: z.string(), count: z.number(), totalPaise: z.number() })),
    byMonth: z.array(monthMoneySchema),
    cancellations: z.number(),
  }),
  money: z.object({
    finishedBookingPaise: z.number(),
    commissionPaise: z.number(),
    payoutsPendingPaise: z.number(),
  }),
  categories: z.array(
    z.object({
      categoryId: z.string().nullish(),
      name: z.string(),
      bookings: z.number(),
      totalPaise: z.number(),
    })
  ),
  topCategory: z
    .object({
      name: z.string().optional(),
      bookings: z.number().optional(),
      totalPaise: z.number().optional(),
    })
    .nullable(),
  byField: z.array(z.object({ ownerRole: z.string(), bookings: z.number(), totalPaise: z.number() })),
  topServices: z.array(
    z.object({
      serviceId: z.string(),
      title: z.string(),
      ownerRole: z.string().optional(),
      category: z.string().nullish(),
      bookings: z.number(),
      totalPaise: z.number(),
    })
  ),
  topServiceByCategory: z.array(
    z.object({
      category: z.string(),
      serviceId: z.string(),
      title: z.string(),
      bookings: z.number(),
      totalPaise: z.number(),
    })
  ),
  bestRatedServices: z.array(
    z.object({
      serviceId: z.string(),
      title: z.string().optional(),
      ratingAverage: z.number(),
      ratingCount: z.number(),
    })
  ),
})

const profileSchema = z
  .object({
    title: z.string().optional().default(""),
    businessName: z.string().optional().default(""),
    about: z.string().optional().default(""),
    city: z.string().optional().default(""),
    profilePhoto: z.string().optional().default(""),
    isActive: z.boolean().optional(),
    cfStatus: z.string().optional().default(""),
  })
  .nullable()

const teamProfileSchema = z
  .object({
    city: z.string().optional().default(""),
    place: z.string().optional().default(""),
  })
  .nullable()

export const adminPersonSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  role: z.string(),
  isActive: z.boolean(),
  isPhoneVerified: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
  bannedUntil: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  talent: profileSchema.optional(),
  vendor: profileSchema.optional(),
  team: teamProfileSchema.optional(),
})

export const adminPersonActiveSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  role: z.string(),
  isActive: z.boolean(),
})

const ownerContactSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  role: z.string().optional(),
})

export const adminServiceSchema = z.object({
  _id: z.string(),
  title: z.string(),
  ownerRole: z.string().optional(),
  status: z.string().optional(),
  isActive: z.boolean().optional(),
  city: z.string().optional().default(""),
  pricePaise: z.number().nullish(),
  ratingAverage: z.number().optional().default(0),
  ratingCount: z.number().optional().default(0),
  createdAt: z.string().optional(),
  category: z.object({ _id: z.string(), name: z.string() }).nullable().optional(),
  owner: ownerContactSchema.nullable().optional(),
})

export const adminServiceDetailSchema = z.object({
  service: z.object({
    _id: z.string(),
    ownerId: z.string().optional(),
    ownerRole: z.string().optional(),
    title: z.string(),
    description: z.string().optional().default(""),
    tags: z.array(z.string()).optional().default([]),
    media: z.array(z.object({ kind: z.string(), url: z.string() })).optional().default([]),
    dayStartTime: z.string().optional().default(""),
    dayEndTime: z.string().optional().default(""),
    weekdays: z.array(z.string()).optional().default([]),
    pricingType: z.string().optional(),
    pricePaise: z.number().nullish(),
    minDuration: z.number().nullish(),
    maxDuration: z.number().nullish(),
    city: z.string().optional().default(""),
    languages: z.array(z.string()).optional().default([]),
    status: z.string(),
    isActive: z.boolean(),
    ratingAverage: z.number().optional().default(0),
    ratingCount: z.number().optional().default(0),
    createdAt: z.string().optional(),
  }),
  category: z.object({ _id: z.string(), name: z.string() }).nullable(),
  owner: ownerContactSchema.nullable(),
  slots: z
    .array(
      z.object({
        _id: z.string(),
        date: z.string(),
        startAt: z.string(),
        endAt: z.string(),
        status: z.string(),
      })
    )
    .optional()
    .default([]),
})

const partySchema = z.object({
  _id: z.string().optional(),
  fullName: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  role: z.string().optional(),
})

export const adminBookingSchema = z.object({
  _id: z.string(),
  status: z.string(),
  shootLocation: z.string().optional().default(""),
  quantity: z.number().optional(),
  totalPaise: z.number().optional(),
  upfrontPaise: z.number().optional(),
  remainingPaise: z.number().optional(),
  paymentOption: z.string().optional(),
  createdAt: z.string().optional(),
  service: z
    .object({
      _id: z.string().optional(),
      title: z.string(),
      ownerRole: z.string().optional(),
      category: z.union([z.string(), z.object({ _id: z.string().optional(), name: z.string() })]).optional(),
    })
    .nullable(),
  customer: partySchema.nullable(),
  provider: partySchema.nullable(),
  teamMember: z
    .object({
      _id: z.string(),
      fullName: z.string(),
      phone: z.string().nullish(),
      city: z.string().optional().default(""),
      place: z.string().optional().default(""),
    })
    .nullable()
    .optional(),
})

export const teamMemberSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  city: z.string().optional().default(""),
  place: z.string().optional().default(""),
})

export const teamCreateSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter a name.").max(60, "Name must be 60 characters or less."),
    phone: z.string().trim().optional(),
    email: z.string().trim().optional(),
    city: z.string().trim().min(1, "Enter a city.").max(80, "City must be 80 characters or less."),
    place: z.string().trim().min(1, "Enter a place.").max(120, "Place must be 120 characters or less."),
  })
  .superRefine((value, ctx) => {
    const phone = value.phone?.trim() ?? ""
    const email = value.email?.trim() ?? ""
    if (!phone && !email) {
      ctx.addIssue({ code: "custom", path: ["phone"], message: "Enter a phone or an email." })
    }
    if (phone && !phoneSchema.safeParse(phone).success) {
      ctx.addIssue({ code: "custom", path: ["phone"], message: "Enter a valid 10-digit mobile number." })
    }
    if (email && !z.email().safeParse(email).success) {
      ctx.addIssue({ code: "custom", path: ["email"], message: "Enter a valid email." })
    }
  })
  .transform((value) => {
    const next: { fullName: string; city: string; place: string; phone?: string; email?: string } = {
      fullName: value.fullName,
      city: value.city,
      place: value.place,
    }
    if (value.phone?.trim()) next.phone = phoneSchema.parse(value.phone)
    if (value.email?.trim()) next.email = value.email.trim()
    return next
  })

export const categorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  isActive: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const categoryBodySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(60, "Name must be 60 characters or less."),
})

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
})

function pageSchema<T extends z.ZodType>(row: T) {
  return z.object({
    success: z.literal(true),
    message: z.string(),
    data: z.array(row),
    pagination: paginationSchema,
  })
}

export const adminDashboardResponseSchema = successSchema(adminDashboardSchema)
export const adminPeoplePageSchema = pageSchema(adminPersonSchema)
export const adminPersonActiveResponseSchema = successSchema(adminPersonActiveSchema)
export const adminServicesPageSchema = pageSchema(adminServiceSchema)
export const adminServiceDetailResponseSchema = successSchema(adminServiceDetailSchema)
export const adminBookingsPageSchema = pageSchema(adminBookingSchema)
export const adminBookingResponseSchema = successSchema(adminBookingSchema)
export const adminTeamResponseSchema = successSchema(
  z.object({ count: z.number(), members: z.array(teamMemberSchema) })
)
export const teamMemberResponseSchema = successSchema(teamMemberSchema)
export const adminCategoriesResponseSchema = successSchema(z.array(categorySchema))
export const categoryResponseSchema = successSchema(categorySchema)
export const statusResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
})

export type AdminDashboard = z.infer<typeof adminDashboardSchema>
export type AdminPerson = z.infer<typeof adminPersonSchema>
export type AdminServiceRow = z.infer<typeof adminServiceSchema>
export type AdminServiceDetail = z.infer<typeof adminServiceDetailSchema>
export type AdminBooking = z.infer<typeof adminBookingSchema>
export type TeamMember = z.infer<typeof teamMemberSchema>
export type ApiCategory = z.infer<typeof categorySchema>
