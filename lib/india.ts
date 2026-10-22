import { fetchStates } from "@/lib/locations"

/** Cached state names from GET /api/locations/states. */
let cachedStates: string[] | null = null
let loading: Promise<string[]> | null = null

export async function loadIndianStates(): Promise<string[]> {
  if (cachedStates) return cachedStates
  if (loading) return loading
  loading = fetchStates()
    .then((list) => {
      cachedStates = list.map((item) => item.name)
      return cachedStates
    })
    .catch(() => [])
    .finally(() => {
      loading = null
    })
  return loading
}
