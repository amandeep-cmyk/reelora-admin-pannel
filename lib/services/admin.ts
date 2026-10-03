import { api, parseResponse } from "@/lib/api/axiosInterceptor"
import { endpoints } from "@/lib/api/endpoints"
import {
  adminBookingResponseSchema,
  adminBookingsPageSchema,
  adminCategoriesResponseSchema,
  adminDashboardResponseSchema,
  adminPeoplePageSchema,
  adminPersonActiveResponseSchema,
  adminServiceDetailResponseSchema,
  adminServicesPageSchema,
  adminTeamResponseSchema,
  bookingStatuses,
  categoryBodySchema,
  categoryResponseSchema,
  statusResponseSchema,
  teamCreateSchema,
  teamMemberResponseSchema,
} from "@/lib/schemas/admin.schema"

function withQuery(path: string, query: Record<string, string | undefined>) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value)
  }
  const search = params.toString()
  return search ? `${path}?${search}` : path
}

export async function getAdminDashboard(query: { from?: string; to?: string }) {
  const { data } = await api.get(withQuery(endpoints.admin.dashboard, query))
  return parseResponse(adminDashboardResponseSchema, data).data
}

export async function getAdminPeople(query: { page?: string; role?: string; isActive?: string }) {
  const { data } = await api.get(withQuery(endpoints.admin.people, { ...query, limit: "50" }))
  return parseResponse(adminPeoplePageSchema, data)
}

export async function setPersonActive(id: string, isActive: boolean) {
  const { data } = await api.patch(endpoints.admin.personActive(id), { isActive })
  return parseResponse(adminPersonActiveResponseSchema, data)
}

export async function getAdminServices(query: { page?: string; categoryId?: string; ownerRole?: string }) {
  const { data } = await api.get(withQuery(endpoints.admin.services, { ...query, limit: "50" }))
  return parseResponse(adminServicesPageSchema, data)
}

export async function getAdminService(id: string) {
  const { data } = await api.get(endpoints.admin.service(id))
  return parseResponse(adminServiceDetailResponseSchema, data).data
}

export async function getAdminBookings(query: { page?: string; from?: string; to?: string; status?: string }) {
  const { data } = await api.get(withQuery(endpoints.admin.bookings, { ...query, limit: "50" }))
  return parseResponse(adminBookingsPageSchema, data)
}

export async function assignBooking(id: string, teamMemberId: string) {
  const { data } = await api.post(endpoints.admin.assignBooking(id), { teamMemberId })
  return parseResponse(adminBookingResponseSchema, data)
}

export async function setBookingStatus(id: string, status: (typeof bookingStatuses)[number]) {
  const { data } = await api.patch(endpoints.bookings.status(id), { status })
  return parseResponse(statusResponseSchema, data)
}

export async function getAdminTeam() {
  const { data } = await api.get(endpoints.admin.team)
  return parseResponse(adminTeamResponseSchema, data).data
}

export async function createTeamMember(body: {
  fullName: string
  phone?: string
  email?: string
  city: string
  place: string
}) {
  const parsed = teamCreateSchema.parse(body)
  const { data } = await api.post(endpoints.admin.team, parsed)
  return parseResponse(teamMemberResponseSchema, data)
}

export async function getAdminCategories() {
  const { data } = await api.get(endpoints.admin.categories)
  return parseResponse(adminCategoriesResponseSchema, data).data
}

export async function createCategory(name: string) {
  const parsed = categoryBodySchema.parse({ name })
  const { data } = await api.post(endpoints.admin.categories, parsed)
  return parseResponse(categoryResponseSchema, data)
}

export async function updateCategory(id: string, body: { name?: string; isActive?: boolean }) {
  const { data } = await api.patch(endpoints.admin.category(id), body)
  return parseResponse(categoryResponseSchema, data)
}
