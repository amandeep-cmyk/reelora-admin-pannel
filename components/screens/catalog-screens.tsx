"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Eye, Package, Pencil, Star } from "lucide-react"
import { ownerName } from "@/lib/data"
import { formatDate, formatInr } from "@/lib/money"
import { useCrm } from "@/components/providers/crm-provider"
import {
  BackTitle,
  DataTable,
  Facts,
  GradientButton,
  Modal,
  Page,
  Pill,
  SheetCard,
  StatCard,
  StatusText,
  TextField,
} from "@/components/crm/ui"
import { Missing } from "@/components/screens/people-screens"
import type { AdminServiceDetail } from "@/lib/schemas/admin.schema"
import type { Review } from "@/lib/schemas/review.schema"
import { getAdminService } from "@/lib/services/admin"
import { getAdminReviews } from "@/lib/services/review"

export function ProductList() {
  const { services } = useCrm()
  const rows = services.filter((item) => item.ownerType === "vendor")
  return (
    <Page title="Products">
      <p className="mb-5 max-w-2xl text-sm text-[#B4B4B4]">
        Gear, crew and locations are services. Vendor listings are shown here.
      </p>
      <div className="mb-6 max-w-xs">
        <StatCard icon={Package} value={String(rows.length)} label="Vendor listings" />
      </div>
      <DataTable
        title="Vendor services"
        rows={rows}
        searchText={(row) => `${row.title} ${row.category} ${row.city}`}
        columns={[
          { header: "Listing", cell: (row) => <Link href={`/services/${row.id}`} className="hover:text-[#E1306C]">{row.title}</Link> },
          { header: "Category", cell: (row) => row.category || "—" },
          { header: "City", cell: (row) => row.city || "—" },
          { header: "Price", cell: (row) => (row.pricePaise ? `${formatInr(row.pricePaise)} / day` : "—") },
          { header: "Listing", cell: (row) => <StatusText value={row.listingStatus || "draft"} /> },
        ]}
        actions={(row) => [{ label: "View", icon: Eye, href: `/services/${row.id}` }]}
      />
    </Page>
  )
}

export function ApprovalList() {
  const { services } = useCrm()
  const queue = services.filter((item) => item.listingStatus !== "published" || item.status === "Inactive")
  return (
    <Page title="Unpublished listings">
      <p className="mb-5 max-w-2xl text-sm text-[#B4B4B4]">
        Providers publish their own services. This list is every draft or hidden listing. There is no separate approval action.
      </p>
      <div className="mb-6 max-w-xs">
        <StatCard icon={Package} value={String(queue.length)} label="Not live" />
      </div>
      <DataTable
        title="Drafts and hidden services"
        rows={queue}
        searchText={(row) => `${row.title} ${row.category}`}
        columns={[
          { header: "Service", cell: (row) => <Link href={`/services/${row.id}`} className="hover:text-[#E1306C]">{row.title}</Link> },
          { header: "Owner", cell: (row) => row.ownerType },
          { header: "Category", cell: (row) => row.category || "—" },
          { header: "Listing", cell: (row) => <StatusText value={row.listingStatus || "draft"} /> },
          { header: "Visible", cell: (row) => <StatusText value={row.status} /> },
        ]}
        actions={(row) => [{ label: "View", icon: Eye, href: `/services/${row.id}` }]}
      />
    </Page>
  )
}

export function ProductProfile() {
  const params = useParams<{ id: string }>()
  return (
    <SheetCard>
      <BackTitle href="/products" title="Listing" />
      <p className="text-sm text-[#B4B4B4]">Open this listing on the service page.</p>
      <Link href={`/services/${params.id}`} className="mt-3 inline-block text-sm text-[#E1306C]">Service overview</Link>
    </SheetCard>
  )
}

export function ServiceList() {
  const { services, talents, vendors, bookings } = useCrm()
  const published = services.filter((item) => item.listingStatus === "published").length
  return (
    <Page title="Services">
      <div className="mb-6 grid max-w-3xl gap-4 sm:grid-cols-3">
        <StatCard icon={Package} value={String(services.length)} label="Services" />
        <StatCard icon={Package} value={String(published)} label="Published" />
        <StatCard icon={Package} value={String(bookings.length)} label="Bookings" />
      </div>
      <DataTable
        title="All services"
        rows={services}
        searchText={(row) => `${row.title} ${row.category} ${row.city}`}
        columns={[
          { header: "Service", cell: (row) => <Link href={`/services/${row.id}`} className="hover:text-[#E1306C]">{row.title}</Link> },
          { header: "Owner", cell: (row) => row.ownerName || ownerName(row, talents, vendors) },
          { header: "Category", cell: (row) => row.category || "—" },
          { header: "Price", cell: (row) => (row.pricePaise ? `${formatInr(row.pricePaise)} / day` : "—") },
          { header: "Rating", cell: (row) => (row.ratingCount ? `${row.ratingAverage?.toFixed(1)} (${row.ratingCount})` : "—") },
          { header: "Listing", cell: (row) => <StatusText value={row.listingStatus || "draft"} /> },
        ]}
        actions={(row) => [{ label: "View", icon: Eye, href: `/services/${row.id}` }]}
      />
    </Page>
  )
}

export function ServiceProfile() {
  const params = useParams<{ id: string }>()
  const { bookings } = useCrm()
  const [detail, setDetail] = useState<AdminServiceDetail | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    let live = true
    getAdminService(params.id)
      .then((data) => {
        if (live) setDetail(data)
      })
      .catch(() => {
        if (live) setMissing(true)
      })
    getAdminReviews({ serviceId: params.id })
      .then((page) => {
        if (live) setReviews(page.data)
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [params.id])

  if (missing) return <Missing href="/services" label="Services" />
  if (!detail) return <p className="text-sm text-[#B4B4B4]">Loading service…</p>

  const service = detail.service
  const history = bookings.filter((item) => item.serviceId === service._id)
  const owner = detail.owner
  const ownerHref = owner ? (owner.role === "vendor" || service.ownerRole === "vendor" ? `/vendors/${owner._id}` : `/talents/${owner._id}`) : ""
  const photo = service.media[0]?.url || ""

  return (
    <>
      <SheetCard>
        <BackTitle href="/services" title="Service overview" />
        <div className="flex flex-wrap items-center gap-4">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="size-[72px] rounded-full object-cover" />
          ) : (
            <div className="flex size-[72px] items-center justify-center rounded-full bg-[#333] text-2xl">{service.title.slice(0, 1)}</div>
          )}
          <div>
            <p className="text-2xl font-semibold">{service.title}</p>
            <div className="mt-1 flex items-center gap-2">
              <Pill>{detail.category?.name || "No category"}</Pill>
              <StatusText value={service.status} />
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Mini label="Bookings" value={String(history.length)} />
          <Mini label="Rating" value={service.ratingCount ? `${service.ratingAverage.toFixed(1)} (${service.ratingCount})` : "—"} />
          <Mini label="Day price" value={service.pricePaise ? formatInr(service.pricePaise) : "—"} />
          <Mini label="Visible" value={service.isActive ? "Yes" : "No"} />
        </div>
        <div className="mt-6">
          <Facts
            items={[
              { label: "Owner", value: owner?.fullName || "—" },
              { label: "Phone", value: owner?.phone || "—" },
              { label: "Email", value: owner?.email || "—" },
              { label: "City", value: service.city || "—" },
              { label: "Hours", value: service.dayStartTime && service.dayEndTime ? `${service.dayStartTime} – ${service.dayEndTime}` : "—" },
              { label: "Weekdays", value: service.weekdays.join(", ") || "—" },
              { label: "Tags", value: service.tags.join(", ") || "—" },
              { label: "Languages", value: service.languages.join(", ") || "—" },
              { label: "About", value: service.description || "—" },
            ]}
          />
          {ownerHref ? <Link href={ownerHref} className="mt-4 inline-block text-sm text-[#E1306C]">Open {owner?.fullName}</Link> : null}
        </div>
      </SheetCard>
      <SheetCard>
        <h2 className="mb-4 text-lg font-semibold">Working days</h2>
        <div className="pink-scroll overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-[#B4B4B4]">
              <tr>
                {["Date", "Start", "End", "Status"].map((head) => (
                  <th key={head} className="px-4 py-3 font-medium">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detail.slots.map((slot) => (
                <tr key={slot._id} className="border-t border-white/8">
                  <td className="px-4 py-3">{formatDate(slot.date)}</td>
                  <td className="px-4 py-3">{slot.startAt.slice(11, 16)}</td>
                  <td className="px-4 py-3">{slot.endAt.slice(11, 16)}</td>
                  <td className="px-4 py-3"><StatusText value={slot.status} /></td>
                </tr>
              ))}
              {detail.slots.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-[#B4B4B4]">No days saved.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </SheetCard>
      <SheetCard>
        <h2 className="mb-4 text-lg font-semibold">Reviews</h2>
        <div className="grid gap-3">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-2xl bg-[#2a2a2a] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{review.reviewer.name}</p>
                <span className="flex items-center gap-1 text-sm text-[#F77737]">
                  <Star className="size-4 fill-[#F77737]" /> {review.stars}
                </span>
              </div>
              {review.comment ? <p className="mt-2 text-sm leading-6 text-[#d7d7d7]">{review.comment}</p> : null}
              <p className="mt-2 text-xs text-[#B4B4B4]">{formatDate(review.createdAt)}</p>
            </div>
          ))}
          {reviews.length === 0 ? <p className="text-sm text-[#B4B4B4]">No reviews yet.</p> : null}
        </div>
      </SheetCard>
    </>
  )
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#2a2a2a] p-4">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-[#B4B4B4]">{label}</p>
    </div>
  )
}

export function CategoryList() {
  const { categories, services, addCategory, saveCategory } = useCrm()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState("")
  const editing = categories.find((item) => item.id === editId) ?? null
  const counts = useMemo(() => {
    const map = new Map<string, number>()
    services.forEach((item) => map.set(item.category, (map.get(item.category) ?? 0) + 1))
    return map
  }, [services])

  return (
    <Page title="Categories" action={<GradientButton onClick={() => setOpen(true)}>Add Category</GradientButton>}>
      <p className="mb-5 max-w-2xl text-sm text-[#B4B4B4]">
        Active categories are the ones providers can choose on a service.
      </p>
      <DataTable
        title="All categories"
        rows={categories}
        searchText={(row) => row.name}
        columns={[
          { header: "Name", cell: (row) => row.name },
          { header: "Listings", cell: (row) => String(counts.get(row.name) ?? 0) },
          { header: "Status", cell: (row) => <StatusText value={row.status} /> },
        ]}
        actions={(row) => [
          { label: "Rename", icon: Pencil, onSelect: () => setEditId(row.id) },
          {
            label: row.status === "Active" ? "Deactivate" : "Activate",
            icon: Pencil,
            onSelect: () => {
              void saveCategory(row.id, { isActive: row.status !== "Active" }).catch(() => {})
            },
          },
        ]}
      />
      <CategoryForm
        open={open || Boolean(editing)}
        initialName={editing?.name ?? ""}
        title={editing ? "Rename category" : "Add category"}
        onClose={() => {
          setOpen(false)
          setEditId("")
        }}
        onSubmit={(name) => {
          const save = editing ? saveCategory(editing.id, { name }) : addCategory(name)
          void save
            .then(() => {
              setOpen(false)
              setEditId("")
            })
            .catch(() => {})
        }}
      />
    </Page>
  )
}

function CategoryForm({
  open,
  initialName,
  title,
  onClose,
  onSubmit,
}: {
  open: boolean
  initialName: string
  title: string
  onClose: () => void
  onSubmit: (name: string) => void
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <CategoryFields key={initialName || "new"} title={title} initialName={initialName} onSubmit={onSubmit} />
    </Modal>
  )
}

function CategoryFields({
  title,
  initialName,
  onSubmit,
}: {
  title: string
  initialName: string
  onSubmit: (name: string) => void
}) {
  const [name, setName] = useState(initialName)
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (name.trim().length < 2) return
        onSubmit(name.trim())
      }}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <TextField label="Name" value={name} placeholder="Drone pilots" onChange={setName} />
      <GradientButton type="submit" className="mx-auto mt-2 w-40">Save</GradientButton>
    </form>
  )
}
