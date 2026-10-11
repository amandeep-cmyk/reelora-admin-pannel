import { api, parseResponse } from "@/lib/api/axiosInterceptor"
import { endpoints } from "@/lib/api/endpoints"
import {
  bannerListSchema,
  bannerResponseSchema,
  deletedSchema,
  eventListSchema,
  eventResponseSchema,
  talentListSchema,
  talentResponseSchema,
} from "@/lib/schemas/marketing.schema"

export async function listBanners() {
  const { data } = await api.get(endpoints.marketing.banners)
  return parseResponse(bannerListSchema, data).data
}

export async function createBanner(body: FormData) {
  const { data } = await api.post(endpoints.marketing.banners, body)
  return parseResponse(bannerResponseSchema, data)
}

export async function updateBanner(id: string, body: FormData) {
  const { data } = await api.patch(endpoints.marketing.banner(id), body)
  return parseResponse(bannerResponseSchema, data)
}

export async function deleteBanner(id: string) {
  const { data } = await api.delete(endpoints.marketing.banner(id))
  return parseResponse(deletedSchema, data)
}

export async function listEvents() {
  const { data } = await api.get(endpoints.marketing.events)
  return parseResponse(eventListSchema, data).data
}

export async function createEvent(body: FormData) {
  const { data } = await api.post(endpoints.marketing.events, body)
  return parseResponse(eventResponseSchema, data)
}

export async function updateEvent(id: string, body: FormData) {
  const { data } = await api.patch(endpoints.marketing.event(id), body)
  return parseResponse(eventResponseSchema, data)
}

export async function deleteEvent(id: string) {
  const { data } = await api.delete(endpoints.marketing.event(id))
  return parseResponse(deletedSchema, data)
}

export async function listFeaturedTalents() {
  const { data } = await api.get(endpoints.marketing.talents)
  return parseResponse(talentListSchema, data).data
}

export async function createFeaturedTalent(body: FormData) {
  const { data } = await api.post(endpoints.marketing.talents, body)
  return parseResponse(talentResponseSchema, data)
}

export async function updateFeaturedTalent(id: string, body: FormData) {
  const { data } = await api.patch(endpoints.marketing.talent(id), body)
  return parseResponse(talentResponseSchema, data)
}

export async function deleteFeaturedTalent(id: string) {
  const { data } = await api.delete(endpoints.marketing.talent(id))
  return parseResponse(deletedSchema, data)
}
