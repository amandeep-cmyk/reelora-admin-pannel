// Loads admin lists from the API. Pages call these directly.

import {
  getAdminBookings,
  getAdminCategories,
  getAdminPeople,
  getAdminServices,
  getAdminTeam,
} from "@/lib/services/admin"
import {
  mapBooking,
  mapCategory,
  mapClient,
  mapMember,
  mapService,
  mapTalent,
  mapVendor,
} from "@/lib/map"
import type { Booking, Category, Client, Member, Service, Talent, Vendor } from "@/lib/types"

type PageResult<T> = { data: T[]; pagination: { hasNextPage: boolean } }

// Walks every page until the API says there is no next page.
async function loadAllPages<T>(load: (page: string) => Promise<PageResult<T>>) {
  const rows: T[] = []
  for (let page = 1; page <= 40; page += 1) {
    const result = await load(String(page))
    rows.push(...result.data)
    if (!result.pagination.hasNextPage) break
  }
  return rows
}

export async function loadClients(): Promise<Client[]> {
  const people = await loadAllPages((page) => getAdminPeople({ page, role: "user" }))
  return people.map(mapClient)
}

export async function loadTalents(): Promise<Talent[]> {
  const people = await loadAllPages((page) => getAdminPeople({ page, role: "talent" }))
  return people.map(mapTalent)
}

export async function loadVendors(): Promise<Vendor[]> {
  const people = await loadAllPages((page) => getAdminPeople({ page, role: "vendor" }))
  return people.map(mapVendor)
}

export async function loadServices(): Promise<Service[]> {
  const rows = await loadAllPages((page) => getAdminServices({ page }))
  return rows.map(mapService)
}

export async function loadBookings(): Promise<Booking[]> {
  const rows = await loadAllPages((page) => getAdminBookings({ page }))
  return rows.map(mapBooking)
}

export async function loadCategories(): Promise<Category[]> {
  const rows = await getAdminCategories()
  return rows.map(mapCategory)
}

export async function loadTeam(): Promise<Member[]> {
  const result = await getAdminTeam()
  return result.members.map(mapMember)
}

// Used by search: load the main directories in parallel.
export async function loadSearchIndex() {
  const [clients, talents, vendors, services, bookings] = await Promise.all([
    loadClients(),
    loadTalents(),
    loadVendors(),
    loadServices(),
    loadBookings(),
  ])
  return { clients, talents, vendors, services, bookings }
}
