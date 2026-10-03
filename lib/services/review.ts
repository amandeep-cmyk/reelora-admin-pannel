import { api, parseResponse } from "@/lib/api/axiosInterceptor"
import { endpoints } from "@/lib/api/endpoints"
import { reviewPageSchema } from "@/lib/schemas/review.schema"

export async function getAdminReviews(query: { serviceId?: string; clientId?: string; providerId?: string }) {
  const params = new URLSearchParams()
  if (query.serviceId) params.set("serviceId", query.serviceId)
  if (query.clientId) params.set("clientId", query.clientId)
  if (query.providerId) params.set("providerId", query.providerId)
  params.set("page", "1")
  params.set("limit", "20")
  const { data } = await api.get(`${endpoints.reviews.list}?${params}`)
  return parseResponse(reviewPageSchema, data)
}
