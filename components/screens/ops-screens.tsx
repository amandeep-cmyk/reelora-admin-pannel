"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ZodError } from "zod"
import { toast } from "sonner"
import { Eye, ShieldBan, ShieldCheck } from "lucide-react"
import { useCrm } from "@/components/providers/crm-provider"
import {
  DataTable,
  GradientButton,
  Modal,
  Page,
  SheetCard,
  StatusText,
  TextField,
} from "@/components/crm/ui"

export function BannerList() {
  return (
    <Page title="Banner Management">
      <p className="max-w-2xl text-sm leading-6 text-[#B4B4B4]">
        The backend has no banner routes. Homepage images are not managed from this panel yet.
      </p>
    </Page>
  )
}

export function TeamList() {
  const { team, addTeamMember, setActive } = useCrm()
  const [open, setOpen] = useState(false)
  return (
    <Page title="Team" action={<GradientButton onClick={() => setOpen(true)}>Add member</GradientButton>}>
      <p className="mb-5 max-w-2xl text-sm text-[#B4B4B4]">
        Team members sign in with the same one-time code as everyone else. Assign them from a booking.
      </p>
      <DataTable
        title="Team"
        rows={team}
        searchText={(row) => `${row.name} ${row.email} ${row.phone} ${row.city} ${row.place}`}
        columns={[
          { header: "Name", cell: (row) => row.name },
          { header: "Phone", cell: (row) => row.phone || "—" },
          { header: "Email", cell: (row) => row.email || "—" },
          { header: "City", cell: (row) => row.city || "—" },
          { header: "Place", cell: (row) => row.place || "—" },
          { header: "Status", cell: (row) => <StatusText value={row.status} /> },
        ]}
        actions={(row) => [
          {
            label: "View",
            icon: Eye,
            onSelect: () => toast.message(`${row.name} · ${row.city} · ${row.place}`),
          },
          {
            label: row.status === "Active" ? "Deactivate" : "Activate",
            icon: row.status === "Active" ? ShieldBan : ShieldCheck,
            tone: row.status === "Active" ? "danger" : "ok",
            onSelect: () => {
              void setActive(row.id, row.status !== "Active").catch(() => {})
            },
          },
        ]}
      />
      <MemberForm
        open={open}
        onClose={() => setOpen(false)}
        onCreate={async (body) => {
          await addTeamMember(body)
          toast.success("Team member added.")
          setOpen(false)
        }}
      />
    </Page>
  )
}

function MemberForm({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (body: { fullName: string; phone?: string; email?: string; city: string; place: string }) => Promise<void>
}) {
  return (
    <Modal open={open} onClose={onClose} wide>
      <MemberFields key={open ? "open" : "closed"} onCreate={onCreate} />
    </Modal>
  )
}

function MemberFields({
  onCreate,
}: {
  onCreate: (body: { fullName: string; phone?: string; email?: string; city: string; place: string }) => Promise<void>
}) {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("")
  const [place, setPlace] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault()
        setError("")
        setPending(true)
        onCreate({
          fullName,
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          city,
          place,
        })
          .catch((caught) => {
            if (caught instanceof ZodError) setError(caught.issues[0]?.message ?? "Check the form.")
          })
          .finally(() => setPending(false))
      }}
    >
      <TextField label="Name" value={fullName} placeholder="Ravi Shah" onChange={setFullName} />
      <TextField label="Phone" value={phone} placeholder="9876543210" onChange={setPhone} />
      <TextField label="Email" value={email} placeholder="ravi@relora.app" onChange={setEmail} />
      <TextField label="City" value={city} placeholder="Mumbai" onChange={setCity} />
      <div className="md:col-span-2">
        <TextField label="Place" value={place} placeholder="Andheri west" onChange={setPlace} />
      </div>
      {error ? <p className="text-sm text-[#E1306C] md:col-span-2">{error}</p> : null}
      <div className="md:col-span-2 flex justify-center">
        <GradientButton type="submit" className="w-40">{pending ? "Saving…" : "Create"}</GradientButton>
      </div>
    </form>
  )
}

export function MembershipList() {
  return (
    <Page title="Membership">
      <p className="max-w-2xl text-sm leading-6 text-[#B4B4B4]">
        The backend has no membership plans. Provider payouts are tracked on the dashboard from finished bookings.
      </p>
    </Page>
  )
}

export function PlanProfile() {
  return (
    <SheetCard>
      <p className="text-sm text-[#B4B4B4]">Membership plans are not in the backend.</p>
      <Link href="/membership" className="mt-3 inline-block text-sm text-[#E1306C]">Back to membership</Link>
    </SheetCard>
  )
}

export function SearchScreen() {
  const params = useSearchParams()
  const query = (params.get("q") ?? "").trim().toLowerCase()
  const crm = useCrm()
  const hits: { href: string; label: string; kind: string; meta: string }[] = []
  if (query) {
    crm.talents.forEach((item) => {
      if (`${item.name} ${item.category} ${item.location}`.toLowerCase().includes(query)) {
        hits.push({ href: `/talents/${item.id}`, label: item.name, kind: "Talent", meta: item.location })
      }
    })
    crm.vendors.forEach((item) => {
      if (`${item.name} ${item.city}`.toLowerCase().includes(query)) {
        hits.push({ href: `/vendors/${item.id}`, label: item.name, kind: "Vendor", meta: item.city })
      }
    })
    crm.clients.forEach((item) => {
      if (`${item.name} ${item.email} ${item.phone}`.toLowerCase().includes(query)) {
        hits.push({ href: `/clients/${item.id}`, label: item.name, kind: "Client", meta: item.phone })
      }
    })
    crm.services.forEach((item) => {
      if (`${item.title} ${item.category} ${item.city}`.toLowerCase().includes(query)) {
        hits.push({ href: `/services/${item.id}`, label: item.title, kind: "Service", meta: item.category })
      }
    })
    crm.bookings.forEach((item) => {
      if (`${item.title} ${item.clientName} ${item.category}`.toLowerCase().includes(query)) {
        hits.push({ href: `/bookings/${item.id}`, label: item.title, kind: "Booking", meta: item.clientName })
      }
    })
  }
  return (
    <Page title="Search">
      <p className="mb-4 text-sm text-[#B4B4B4]">{query ? `Results for “${query}”` : "Type in global search."}</p>
      <div className="grid gap-2">
        {hits.map((hit) => (
          <Link key={hit.href + hit.label} href={hit.href} className="flex items-center justify-between rounded-2xl bg-[#2a2a2a] px-4 py-3">
            <span>
              <span className="block">{hit.label}</span>
              <span className="text-xs text-[#B4B4B4]">{hit.meta}</span>
            </span>
            <span className="text-sm text-[#E1306C]">{hit.kind}</span>
          </Link>
        ))}
        {query && hits.length === 0 ? <p className="text-sm text-[#B4B4B4]">No matches.</p> : null}
      </div>
    </Page>
  )
}
