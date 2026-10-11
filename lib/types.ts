// Shapes the admin UI uses after mapping API rows.

export type PersonStatus = "Active" | "Inactive"

export type Client = {
  id: string
  name: string
  email: string
  phone: string
  registeredOn: string
  about: string
  photo: string
  status: PersonStatus
}

export type Talent = {
  id: string
  name: string
  category: string
  email: string
  phone: string
  registeredOn: string
  location: string
  tagline: string
  about: string
  photo: string
  status: PersonStatus
  payout?: string
}

export type Vendor = {
  id: string
  name: string
  email: string
  phone: string
  registeredOn: string
  preferred: string
  city: string
  about: string
  photo: string
  status: PersonStatus
  payout?: string
}

export type Service = {
  id: string
  title: string
  ownerType: "vendor" | "talent"
  ownerId: string
  ownerName?: string
  category: string
  pricePaise: number
  city: string
  status: "Active" | "Inactive"
  listingStatus?: string
  ratingAverage?: number
  ratingCount?: number
}

export type Booking = {
  id: string
  clientId: string
  clientName: string
  clientPhone?: string
  clientEmail?: string
  talentId?: string
  talentName?: string
  vendorId?: string
  vendorName?: string
  providerPhone?: string
  providerEmail?: string
  serviceId?: string
  title: string
  category: string
  start: string
  budgetPaise: number | null
  status: string
  shootLocation?: string
  period: string
  teamMemberId?: string
  teamMemberName?: string
}

export type Category = {
  id: string
  name: string
  status: "Active" | "Inactive"
}

export type Member = {
  id: string
  name: string
  email: string
  phone?: string
  city?: string
  place?: string
  status: "Active" | "Inactive"
}
