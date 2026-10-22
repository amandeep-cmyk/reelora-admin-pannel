import { api } from "@/lib/api/axiosInterceptor"
import { endpoints } from "@/lib/api/endpoints"

export type LocationState = { id: number; name: string }
export type CitySuggestion = { city: string; state: string }

export async function fetchStates(): Promise<LocationState[]> {
  const { data } = await api.get(endpoints.locations.states, {
    skipErrorToast: true,
  })
  const list = data?.data
  if (!Array.isArray(list)) return []
  return list.filter(
    (item): item is LocationState =>
      Boolean(item) && typeof item.id === "number" && typeof item.name === "string"
  )
}

export async function searchCities(
  q: string,
  state?: string,
  limit = 10
): Promise<CitySuggestion[]> {
  const { data } = await api.get(endpoints.locations.cities, {
    params: { q, limit, ...(state ? { state } : {}) },
    skipErrorToast: true,
  })
  const list = data?.data
  if (!Array.isArray(list)) return []
  return list.filter(
    (item): item is CitySuggestion =>
      Boolean(item) && typeof item.city === "string" && typeof item.state === "string"
  )
}
