"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { mapBooking, mapCategory, mapClient, mapMember, mapService, mapTalent, mapVendor } from "@/lib/map"
import type { Booking, Category, Client, Member, Service, Talent, Vendor } from "@/lib/data"
import type { AdminBooking, AdminPerson, AdminServiceRow, ApiCategory, BookingStatus, TeamMember } from "@/lib/schemas/admin.schema"
import {
  assignBooking,
  createCategory,
  createTeamMember,
  getAdminBookings,
  getAdminCategories,
  getAdminPeople,
  getAdminServices,
  getAdminTeam,
  setBookingStatus,
  setPersonActive,
  updateCategory,
} from "@/lib/services/admin"

type Page<T> = { data: T[]; pagination: { hasNextPage: boolean } }

async function allPages<T>(load: (page: string) => Promise<Page<T>>) {
  const rows: T[] = []
  for (let page = 1; page <= 40; page += 1) {
    const result = await load(String(page))
    rows.push(...result.data)
    if (!result.pagination.hasNextPage) break
  }
  return rows
}

async function loadAll() {
  const [people, services, bookings, categories, team] = await Promise.all([
    allPages((page) => getAdminPeople({ page })),
    allPages((page) => getAdminServices({ page })),
    allPages((page) => getAdminBookings({ page })),
    getAdminCategories(),
    getAdminTeam(),
  ])
  return { people, services, bookings, categories, team: team.members }
}

type CrmContextValue = {
  ready: boolean
  error: string
  reload: () => Promise<void>
  talents: Talent[]
  vendors: Vendor[]
  clients: Client[]
  services: Service[]
  bookings: Booking[]
  categories: Category[]
  team: Member[]
  setActive: (id: string, isActive: boolean) => Promise<void>
  assignTeam: (bookingId: string, teamMemberId: string) => Promise<void>
  changeBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>
  addTeamMember: (body: { fullName: string; phone?: string; email?: string; city: string; place: string }) => Promise<void>
  addCategory: (name: string) => Promise<void>
  saveCategory: (id: string, patch: { name?: string; isActive?: boolean }) => Promise<void>
}

const CrmContext = createContext<CrmContextValue | null>(null)

export function CrmProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [people, setPeople] = useState<AdminPerson[]>([])
  const [serviceRows, setServiceRows] = useState<AdminServiceRow[]>([])
  const [bookingRows, setBookingRows] = useState<AdminBooking[]>([])
  const [categoryRows, setCategoryRows] = useState<ApiCategory[]>([])
  const [teamRows, setTeamRows] = useState<TeamMember[]>([])
  const [ready, setReady] = useState(false)
  const [error, setError] = useState("")

  const reload = useCallback(async () => {
    setError("")
    setReady(false)
    try {
      const next = await loadAll()
      setPeople(next.people)
      setServiceRows(next.services)
      setBookingRows(next.bookings)
      setCategoryRows(next.categories)
      setTeamRows(next.team)
    } catch {
      setError("Could not load admin data.")
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    if (user?.role !== "admin") return
    const timer = window.setTimeout(() => {
      void reload()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [user?.id, user?.role, reload])

  const clients = useMemo(() => people.filter((item) => item.role === "user").map(mapClient), [people])
  const talents = useMemo(() => people.filter((item) => item.role === "talent").map(mapTalent), [people])
  const vendors = useMemo(() => people.filter((item) => item.role === "vendor").map(mapVendor), [people])
  const services = useMemo(() => serviceRows.map(mapService), [serviceRows])
  const bookings = useMemo(() => bookingRows.map(mapBooking), [bookingRows])
  const categories = useMemo(() => categoryRows.map(mapCategory), [categoryRows])
  const team = useMemo(() => teamRows.map(mapMember), [teamRows])

  const value: CrmContextValue = {
    ready,
    error,
    reload,
    talents,
    vendors,
    clients,
    services,
    bookings,
    categories,
    team,
    setActive: async (id, isActive) => {
      await setPersonActive(id, isActive)
      setPeople((list) => list.map((item) => (item._id === id ? { ...item, isActive } : item)))
      setTeamRows((list) => list.map((item) => (item._id === id ? { ...item, isActive } : item)))
    },
    assignTeam: async (bookingId, teamMemberId) => {
      const result = await assignBooking(bookingId, teamMemberId)
      setBookingRows((list) => list.map((item) => (item._id === bookingId ? result.data : item)))
    },
    changeBookingStatus: async (bookingId, status) => {
      await setBookingStatus(bookingId, status)
      setBookingRows((list) => list.map((item) => (item._id === bookingId ? { ...item, status } : item)))
    },
    addTeamMember: async (body) => {
      await createTeamMember(body)
      await reload()
    },
    addCategory: async (name) => {
      const result = await createCategory(name)
      setCategoryRows((list) => [...list, result.data].sort((a, b) => a.name.localeCompare(b.name)))
    },
    saveCategory: async (id, patch) => {
      const result = await updateCategory(id, patch)
      setCategoryRows((list) => list.map((item) => (item._id === id ? result.data : item)))
    },
  }

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>
}

export function useCrm() {
  const value = useContext(CrmContext)
  if (!value) throw new Error("useCrm must be used inside CrmProvider")
  return value
}
