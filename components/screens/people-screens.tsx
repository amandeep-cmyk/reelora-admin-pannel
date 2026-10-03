"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Eye, ShieldBan, ShieldCheck, Users } from "lucide-react"
import { useCrm } from "@/components/providers/crm-provider"
import {
  BackTitle,
  DataTable,
  Facts,
  Page,
  Pill,
  SheetCard,
  StatCard,
  StatusText,
  type RowAction,
} from "@/components/crm/ui"
import { formatDate, formatInr } from "@/lib/money"
import type { Review } from "@/lib/schemas/review.schema"
import { getAdminReviews } from "@/lib/services/review"

function filled(items: { label: string; value: string }[]) {
  return items.filter((item) => item.value.trim())
}

export function ClientList() {
  const { clients, setActive } = useCrm()
  const active = clients.filter((item) => item.status === "Active").length
  return (
    <Page title="Client Management">
      <div className="mb-6 grid max-w-2xl gap-4 sm:grid-cols-2">
        <StatCard icon={Users} value={String(clients.length)} label="Clients" />
        <StatCard icon={Users} value={String(active)} label="Active clients" />
      </div>
      <DataTable
        title="All clients"
        rows={clients}
        searchText={(row) => `${row.name} ${row.email} ${row.phone}`}
        columns={[
          { header: "Name", cell: (row) => <Link className="hover:text-[#E1306C]" href={`/clients/${row.id}`}>{row.name}</Link> },
          { header: "Registered", cell: (row) => formatDate(row.registeredOn) },
          { header: "Email", cell: (row) => row.email || "—" },
          { header: "Phone", cell: (row) => row.phone || "—" },
          { header: "Status", cell: (row) => <StatusText value={row.status} /> },
        ]}
        actions={(row) => activeActions(`/clients/${row.id}`, row.status, () => setActive(row.id, row.status !== "Active"))}
      />
    </Page>
  )
}

export function TalentList() {
  const { talents, setActive } = useCrm()
  return (
    <Page title="Talent Management">
      <div className="mb-6 max-w-xs">
        <StatCard icon={Users} value={String(talents.length)} label="Talents" />
      </div>
      <DataTable
        title="All talents"
        rows={talents}
        searchText={(row) => `${row.name} ${row.email} ${row.category} ${row.phone} ${row.location}`}
        columns={[
          { header: "Name", cell: (row) => <Link className="hover:text-[#E1306C]" href={`/talents/${row.id}`}>{row.name}</Link> },
          { header: "Title", cell: (row) => row.tagline || "—" },
          { header: "City", cell: (row) => row.location || "—" },
          { header: "Email", cell: (row) => row.email || "—" },
          { header: "Phone", cell: (row) => row.phone || "—" },
          { header: "Payout", cell: (row) => row.payout || "—" },
          { header: "Status", cell: (row) => <StatusText value={row.status} /> },
        ]}
        actions={(row) => activeActions(`/talents/${row.id}`, row.status, () => setActive(row.id, row.status !== "Active"))}
      />
    </Page>
  )
}

export function VendorList() {
  const { vendors, services, setActive } = useCrm()
  const active = vendors.filter((item) => item.status === "Active").length
  return (
    <Page title="Vendor Management">
      <div className="mb-6 max-w-xs">
        <StatCard icon={Users} value={String(active)} label="Active vendors" />
      </div>
      <DataTable
        title="All vendors"
        rows={vendors}
        searchText={(row) => `${row.name} ${row.email} ${row.phone} ${row.city}`}
        columns={[
          { header: "Business", cell: (row) => <Link className="hover:text-[#E1306C]" href={`/vendors/${row.id}`}>{row.name}</Link> },
          { header: "City", cell: (row) => row.city || "—" },
          { header: "Email", cell: (row) => row.email || "—" },
          { header: "Phone", cell: (row) => row.phone || "—" },
          { header: "Services", cell: (row) => String(services.filter((item) => item.ownerType === "vendor" && item.ownerId === row.id).length) },
          { header: "Payout", cell: (row) => row.payout || "—" },
          { header: "Status", cell: (row) => <StatusText value={row.status} /> },
        ]}
        actions={(row) => activeActions(`/vendors/${row.id}`, row.status, () => setActive(row.id, row.status !== "Active"))}
      />
    </Page>
  )
}

function activeActions<T>(href: string, status: string, onToggle: () => Promise<void>): RowAction<T>[] {
  const turningOff = status === "Active"
  return [
    { label: "View", icon: Eye, href },
    {
      label: turningOff ? "Deactivate" : "Activate",
      icon: turningOff ? ShieldBan : ShieldCheck,
      tone: turningOff ? "danger" : "ok",
      onSelect: () => {
        void onToggle().catch(() => {})
      },
    },
  ]
}

export function ClientProfile() {
  const params = useParams<{ id: string }>()
  const { clients, bookings } = useCrm()
  const client = clients.find((item) => item.id === params.id)
  const reviews = useReviews(client ? { clientId: client.id } : null)
  if (!client) return <Missing href="/clients" label="Clients" />
  const rows = bookings.filter((item) => item.clientId === client.id)
  return (
    <>
      <SheetCard>
        <BackTitle href="/clients" title="Client" />
        <ProfileHead photo={client.photo} name={client.name} role="Customer" />
        <h2 className="mt-6 mb-4 text-lg font-semibold">Contact</h2>
        <Facts
          items={filled([
            { label: "Email", value: client.email },
            { label: "Phone", value: client.phone },
            { label: "Registered", value: formatDate(client.registeredOn) },
            { label: "Status", value: client.status },
            { label: "Note", value: client.about },
          ])}
        />
      </SheetCard>
      <BookingHistory rows={rows} />
      <ReviewList reviews={reviews} />
    </>
  )
}

export function TalentProfile() {
  const params = useParams<{ id: string }>()
  const { talents, bookings, services } = useCrm()
  const talent = talents.find((item) => item.id === params.id)
  const reviews = useReviews(talent ? { providerId: talent.id } : null)
  if (!talent) return <Missing href="/talents" label="Talents" />
  const rows = bookings.filter((item) => item.talentId === talent.id)
  const owned = services.filter((item) => item.ownerType === "talent" && item.ownerId === talent.id)
  return (
    <>
      <SheetCard>
        <BackTitle href="/talents" title="Talent" />
        <ProfileHead photo={talent.photo} name={talent.name} role={talent.category} />
        <h2 className="mt-6 mb-4 text-lg font-semibold">Profile</h2>
        <Facts
          items={filled([
            { label: "Email", value: talent.email },
            { label: "Phone", value: talent.phone },
            { label: "City", value: talent.location },
            { label: "Title", value: talent.tagline },
            { label: "Payout account", value: talent.payout || "" },
            { label: "Registered", value: formatDate(talent.registeredOn) },
            { label: "Status", value: talent.status },
          ])}
        />
        {talent.about ? <About text={talent.about} /> : null}
        {owned.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {owned.map((item) => (
              <Link key={item.id} href={`/services/${item.id}`} className="rounded-full bg-[#2a2a2a] px-3 py-1.5 text-sm text-[#E1306C]">
                {item.title}
              </Link>
            ))}
          </div>
        ) : null}
      </SheetCard>
      <BookingHistory rows={rows} />
      <ReviewList reviews={reviews} />
    </>
  )
}

export function VendorProfile() {
  const params = useParams<{ id: string }>()
  const { vendors, bookings, services } = useCrm()
  const vendor = vendors.find((item) => item.id === params.id)
  const reviews = useReviews(vendor ? { providerId: vendor.id } : null)
  if (!vendor) return <Missing href="/vendors" label="Vendors" />
  const rows = bookings.filter((item) => item.vendorId === vendor.id)
  const owned = services.filter((item) => item.ownerType === "vendor" && item.ownerId === vendor.id)
  return (
    <>
      <SheetCard>
        <BackTitle href="/vendors" title="Vendor" />
        <ProfileHead photo={vendor.photo} name={vendor.name} role="Vendor" />
        <h2 className="mt-6 mb-4 text-lg font-semibold">Profile</h2>
        <Facts
          items={filled([
            { label: "Contact", value: vendor.preferred },
            { label: "Email", value: vendor.email },
            { label: "Phone", value: vendor.phone },
            { label: "City", value: vendor.city },
            { label: "Payout account", value: vendor.payout || "" },
            { label: "Registered", value: formatDate(vendor.registeredOn) },
            { label: "Status", value: vendor.status },
          ])}
        />
        {vendor.about ? <About text={vendor.about} /> : null}
        {owned.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {owned.map((item) => (
              <Link key={item.id} href={`/services/${item.id}`} className="rounded-full bg-[#2a2a2a] px-3 py-1.5 text-sm text-[#E1306C]">
                {item.title}
              </Link>
            ))}
          </div>
        ) : null}
      </SheetCard>
      <BookingHistory rows={rows} />
      <ReviewList reviews={reviews} />
    </>
  )
}

function useReviews(query: { clientId?: string; providerId?: string } | null) {
  const [reviews, setReviews] = useState<Review[]>([])
  const clientId = query?.clientId
  const providerId = query?.providerId
  useEffect(() => {
    if (!clientId && !providerId) return
    let live = true
    getAdminReviews(clientId ? { clientId } : { providerId })
      .then((page) => {
        if (live) setReviews(page.data)
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [clientId, providerId])
  return reviews
}

function ProfileHead({ photo, name, role }: { photo: string; name: string; role: string }) {
  const src = photo.startsWith("http") || photo.startsWith("/") ? photo : ""
  return (
    <div className="flex items-center gap-4">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-[72px] rounded-full object-cover" />
      ) : (
        <div className="flex size-[72px] items-center justify-center rounded-full bg-[#333] text-2xl">{name.slice(0, 1)}</div>
      )}
      <div>
        <p className="text-2xl font-semibold">{name}</p>
        <div className="mt-1"><Pill>{role}</Pill></div>
      </div>
    </div>
  )
}

function About({ text }: { text: string }) {
  return (
    <div className="mt-6">
      <h2 className="mb-2 text-lg font-semibold">About</h2>
      <p className="max-w-3xl text-sm leading-6 text-[#d7d7d7]">{text}</p>
    </div>
  )
}

function BookingHistory({ rows }: { rows: { id: string; title: string; category: string; start: string; budgetPaise: number | null; status: string }[] }) {
  return (
    <SheetCard>
      <h2 className="mb-4 text-lg font-semibold">Bookings</h2>
      <div className="pink-scroll overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="text-[#B4B4B4]">
            <tr>
              {["Service", "Category", "Date", "Amount", "Status"].map((column) => (
                <th key={column} className="px-4 py-3 font-medium">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-t border-white/8">
                <td className="px-4 py-3"><Link href={`/bookings/${item.id}`} className="hover:text-[#E1306C]">{item.title}</Link></td>
                <td className="px-4 py-3">{item.category || "—"}</td>
                <td className="px-4 py-3">{formatDate(item.start)}</td>
                <td className="px-4 py-3">{item.budgetPaise ? formatInr(item.budgetPaise) : "—"}</td>
                <td className="px-4 py-3"><StatusText value={item.status} /></td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-[#B4B4B4]">No bookings yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </SheetCard>
  )
}

function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <SheetCard>
      <h2 className="mb-4 text-lg font-semibold">Reviews</h2>
      <div className="grid gap-3">
        {reviews.map((review) => (
          <div key={review._id} className="rounded-2xl bg-[#2a2a2a] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{review.reviewer.name}</p>
              <span className="text-sm text-[#F77737]">{review.stars} / 5 · {review.direction}</span>
            </div>
            {review.comment ? <p className="mt-2 text-sm leading-6 text-[#d7d7d7]">{review.comment}</p> : null}
            <p className="mt-2 text-xs text-[#B4B4B4]">{formatDate(review.createdAt)}</p>
          </div>
        ))}
        {reviews.length === 0 ? <p className="text-sm text-[#B4B4B4]">No reviews yet.</p> : null}
      </div>
    </SheetCard>
  )
}

export function Thumb({ src, play = false }: { src: string; play?: boolean }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#111]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : null}
      {play ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-9 items-center justify-center rounded-full bg-black/45 text-white ring-2 ring-[#E1306C]">
            <span className="ml-0.5 block size-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-white" />
          </span>
        </span>
      ) : null}
    </div>
  )
}

export function Missing({ href, label }: { href: string; label: string }) {
  return (
    <SheetCard>
      <p className="text-[#B4B4B4]">This record is not in the directory.</p>
      <Link href={href} className="mt-3 inline-block text-sm text-[#E1306C]">Back to {label}</Link>
    </SheetCard>
  )
}

export function LeadList() {
  return (
    <Page title="Lead Requests">
      <p className="max-w-2xl text-sm leading-6 text-[#B4B4B4]">
        The backend has no lead inbox. People who finish registration show up under Clients, Talents, or Vendors.
      </p>
    </Page>
  )
}
