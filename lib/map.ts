import type { Booking, Category, Client, Member, Service, Talent, Vendor } from "@/lib/data"
import type { AdminBooking, AdminPerson, AdminServiceRow, ApiCategory, TeamMember } from "@/lib/schemas/admin.schema"

function activeLabel(isActive: boolean): "Active" | "Inactive" {
  return isActive ? "Active" : "Inactive"
}

function categoryName(service: NonNullable<AdminBooking["service"]>) {
  if (!service.category) return ""
  if (typeof service.category === "string") return service.category
  return service.category.name
}

export function mapClient(person: AdminPerson): Client {
  return {
    id: person._id,
    name: person.fullName,
    userType: "Customer",
    email: person.email || "",
    phone: person.phone || "",
    registeredOn: (person.createdAt || "").slice(0, 10),
    city: "",
    state: "",
    address: "",
    about: person.bannedUntil ? `Booking paused until ${person.bannedUntil.slice(0, 10)}` : "",
    photo: "",
    preferred: "",
    status: activeLabel(person.isActive),
  }
}

export function mapTalent(person: AdminPerson): Talent {
  const profile = person.talent
  return {
    id: person._id,
    name: person.fullName,
    category: profile?.title || "Talent",
    email: person.email || "",
    phone: person.phone || "",
    registeredOn: (person.createdAt || "").slice(0, 10),
    genre: "",
    location: profile?.city || "",
    languages: "",
    experience: "",
    format: "",
    tagline: profile?.title || "",
    gender: "",
    age: "",
    about: profile?.about || "",
    photo: profile?.profilePhoto || "",
    photos: [],
    status: activeLabel(person.isActive),
    payout: profile?.cfStatus || "",
  }
}

export function mapVendor(person: AdminPerson): Vendor {
  const profile = person.vendor
  return {
    id: person._id,
    name: profile?.businessName || person.fullName,
    category: "Vendor",
    email: person.email || "",
    phone: person.phone || "",
    registeredOn: (person.createdAt || "").slice(0, 10),
    preferred: person.fullName,
    city: profile?.city || "",
    state: "",
    address: "",
    about: profile?.about || "",
    photo: profile?.profilePhoto || "",
    status: activeLabel(person.isActive),
    payout: profile?.cfStatus || "",
  }
}

export function mapService(row: AdminServiceRow): Service {
  const published = row.status === "published"
  return {
    id: row._id,
    title: row.title,
    ownerType: row.ownerRole === "vendor" ? "vendor" : "talent",
    ownerId: row.owner?._id || "",
    ownerName: row.owner?.fullName || "",
    category: row.category?.name || "",
    pricePaise: row.pricePaise ?? 0,
    unit: "Day",
    city: row.city || "",
    tags: [],
    description: "",
    photo: "",
    status: published && row.isActive ? "Active" : "Inactive",
    listingStatus: row.status || "draft",
    ratingAverage: row.ratingAverage ?? 0,
    ratingCount: row.ratingCount ?? 0,
  }
}

export function mapBooking(row: AdminBooking): Booking {
  const providerRole = row.provider?.role
  const providerName = row.provider?.fullName || row.provider?.name || ""
  const created = (row.createdAt || "").slice(0, 10)
  return {
    id: row._id,
    kind: "booking",
    clientId: row.customer?._id || "",
    clientName: row.customer?.fullName || row.customer?.name || "Client",
    clientPhone: row.customer?.phone || "",
    clientEmail: row.customer?.email || "",
    talentId: providerRole === "talent" ? row.provider?._id : undefined,
    talentName: providerRole === "talent" ? providerName : undefined,
    vendorId: providerRole === "vendor" ? row.provider?._id : undefined,
    vendorName: providerRole === "vendor" ? providerName : undefined,
    providerPhone: row.provider?.phone || "",
    providerEmail: row.provider?.email || "",
    serviceId: row.service?._id,
    title: row.service?.title || "Removed listing",
    category: row.service ? categoryName(row.service) : "",
    requirement: "Day booking",
    start: created,
    end: created,
    budgetPaise: row.totalPaise ?? null,
    upfrontPaise: row.upfrontPaise,
    remainingPaise: row.remainingPaise,
    status: row.status,
    tags: [],
    city: "",
    shootLocation: row.shootLocation || "",
    channel: "Web",
    payment: "Full online",
    period: row.quantity ? `${row.quantity} day${row.quantity === 1 ? "" : "s"}` : "",
    project: row.service?.title || "",
    quantity: row.quantity,
    teamMemberId: row.teamMember?._id || "",
    teamMemberName: row.teamMember?.fullName || "",
  }
}

export function mapCategory(row: ApiCategory): Category {
  return {
    id: row._id,
    name: row.name,
    group: "Listing",
    description: "",
    status: activeLabel(row.isActive),
  }
}

export function mapMember(row: TeamMember): Member {
  return {
    id: row._id,
    name: row.fullName,
    email: row.email || "",
    phone: row.phone || "",
    city: row.city || "",
    place: row.place || "",
    role: "Team",
    password: "",
    status: row.isActive === false ? "Inactive" : "Active",
  }
}
