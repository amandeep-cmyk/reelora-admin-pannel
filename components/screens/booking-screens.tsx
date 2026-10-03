"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { CalendarDays, Eye } from "lucide-react"
import { useCrm } from "@/components/providers/crm-provider"
import { BackTitle, DataTable, Facts, Page, Pill, SheetCard, StatCard, StatusText } from "@/components/crm/ui"
import { formatDate, formatInr } from "@/lib/money"
import { bookingStatuses, type BookingStatus } from "@/lib/schemas/admin.schema"
import { Missing } from "@/components/screens/people-screens"
import { Button } from "@/components/ui/button"

export function BookingList() {
  const { bookings, vendors, talents } = useCrm()
  const [vendor, setVendor] = useState("All")
  const [talent, setTalent] = useState("All")
  const [category, setCategory] = useState("All")
  const [status, setStatus] = useState("All")

  const rows = useMemo(() => {
    return bookings.filter((item) => {
      if (vendor !== "All" && item.vendorId !== vendor) return false
      if (talent !== "All" && item.talentId !== talent) return false
      if (category !== "All" && item.category !== category) return false
      if (status !== "All" && item.status !== status) return false
      return true
    })
  }, [bookings, vendor, talent, category, status])

  const categories = ["All", ...new Set(bookings.map((item) => item.category).filter(Boolean))]

  return (
    <Page title="Bookings">
      <div className="mb-6 max-w-xs">
        <StatCard icon={CalendarDays} value={String(bookings.length)} label="Total bookings" />
      </div>
      <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MiniSelect value={vendor} onChange={setVendor} options={[{ id: "All", label: "Vendor" }, ...vendors.map((item) => ({ id: item.id, label: item.name }))]} />
        <MiniSelect value={talent} onChange={setTalent} options={[{ id: "All", label: "Talent" }, ...talents.map((item) => ({ id: item.id, label: item.name }))]} />
        <MiniSelect value={category} onChange={setCategory} options={categories.map((item) => ({ id: item, label: item === "All" ? "Category" : item }))} />
        <MiniSelect
          value={status}
          onChange={setStatus}
          options={[{ id: "All", label: "Status" }, ...bookingStatuses.map((item) => ({ id: item, label: item.replaceAll("_", " ") }))]}
        />
      </div>
      <DataTable
        title="All bookings"
        rows={rows}
        searchText={(row) => `${row.clientName} ${row.title} ${row.category} ${row.shootLocation || ""} ${row.teamMemberName || ""}`}
        columns={[
          { header: "Client", cell: (row) => row.clientName },
          { header: "Service", cell: (row) => row.title },
          { header: "Category", cell: (row) => row.category || "—" },
          { header: "Shoot location", cell: (row) => row.shootLocation || "—" },
          { header: "Created", cell: (row) => formatDate(row.start) },
          { header: "Amount", cell: (row) => (row.budgetPaise ? formatInr(row.budgetPaise) : "—") },
          { header: "Team", cell: (row) => row.teamMemberName || "Unassigned" },
          { header: "Status", cell: (row) => <StatusText value={row.status} /> },
        ]}
        actions={(row) => [{ label: "View", icon: Eye, href: `/bookings/${row.id}` }]}
      />
    </Page>
  )
}

function MiniSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: { id: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 rounded-full border border-white/10 bg-[#2a2a2a] px-3 text-sm capitalize outline-none"
    >
      {options.map((option) => (
        <option key={option.id} value={option.id}>{option.label}</option>
      ))}
    </select>
  )
}

export function BookingProfile() {
  const params = useParams<{ id: string }>()
  const { bookings, team, assignTeam, changeBookingStatus } = useCrm()
  const booking = bookings.find((item) => item.id === params.id)
  const [memberId, setMemberId] = useState("")
  const [status, setStatus] = useState("")
  const [pending, setPending] = useState("")

  if (!booking) return <Missing href="/bookings" label="Bookings" />
  const row = booking

  const selectedMember = memberId || row.teamMemberId || ""
  const selectedStatus = status || row.status
  const activeTeam = team.filter((item) => item.status === "Active")
  const providerName = row.talentName || row.vendorName || "Provider"
  const providerHref = row.talentId ? `/talents/${row.talentId}` : row.vendorId ? `/vendors/${row.vendorId}` : ""

  async function onAssign() {
    if (!selectedMember) return
    setPending("assign")
    try {
      await assignTeam(row.id, selectedMember)
      toast.success("Team member assigned.")
      setMemberId("")
    } catch {
      // The request layer already shows the error.
    } finally {
      setPending("")
    }
  }

  async function onStatus() {
    if (!bookingStatuses.includes(selectedStatus as BookingStatus)) return
    setPending("status")
    try {
      await changeBookingStatus(row.id, selectedStatus as BookingStatus)
      toast.success("Booking status updated.")
      setStatus("")
    } catch {
      // The request layer already shows the error.
    } finally {
      setPending("")
    }
  }

  return (
    <SheetCard>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <BackTitle href="/bookings" title="Booking" />
        <StatusText value={row.status} />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex size-[72px] items-center justify-center rounded-full bg-[#333] text-2xl">{providerName.slice(0, 1)}</div>
        <div>
          <p className="text-2xl font-semibold">{row.title}</p>
          <div className="mt-1"><Pill>{row.category || providerName}</Pill></div>
        </div>
      </div>
      <div className="mt-8 grid gap-8 min-[860px]:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold">Client</h2>
          <Facts
            items={[
              { label: "Name", value: row.clientName },
              { label: "Phone", value: row.clientPhone || "—" },
              { label: "Email", value: row.clientEmail || "—" },
            ]}
          />
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold">Provider</h2>
          <Facts
            items={[
              { label: "Name", value: providerName },
              { label: "Phone", value: row.providerPhone || "—" },
              { label: "Email", value: row.providerEmail || "—" },
              { label: "Shoot location", value: row.shootLocation || "—" },
              { label: "Days", value: row.period || "—" },
              { label: "Amount", value: row.budgetPaise ? formatInr(row.budgetPaise) : "—" },
              { label: "Created", value: formatDate(row.start) },
              { label: "Team", value: row.teamMemberName || "Unassigned" },
            ]}
          />
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-[#2a2a2a] p-4">
          <h2 className="mb-3 text-sm font-medium">Assign a team member</h2>
          <select
            value={selectedMember}
            onChange={(event) => setMemberId(event.target.value)}
            className="h-11 w-full rounded-xl border border-white/10 bg-[#1f1f1f] px-3 text-sm outline-none"
          >
            <option value="">Choose a team member</option>
            {activeTeam.map((item) => (
              <option key={item.id} value={item.id}>{item.name} · {item.city}</option>
            ))}
          </select>
          <Button type="button" variant="gradient" className="mt-3" disabled={!selectedMember || pending === "assign"} onClick={() => void onAssign()}>
            Assign
          </Button>
        </div>
        <div className="rounded-2xl bg-[#2a2a2a] p-4">
          <h2 className="mb-3 text-sm font-medium">Booking status</h2>
          <select
            value={selectedStatus}
            onChange={(event) => setStatus(event.target.value)}
            className="h-11 w-full rounded-xl border border-white/10 bg-[#1f1f1f] px-3 text-sm capitalize outline-none"
          >
            {bookingStatuses.map((item) => (
              <option key={item} value={item}>{item.replaceAll("_", " ")}</option>
            ))}
          </select>
          <p className="mt-2 text-xs text-[#B4B4B4]">Cancelling a paid booking starts a refund.</p>
          <Button type="button" variant="gradient" className="mt-3" disabled={pending === "status"} onClick={() => void onStatus()}>
            Save status
          </Button>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        {row.clientId ? <Link className="text-[#E1306C]" href={`/clients/${row.clientId}`}>Client profile</Link> : null}
        {providerHref ? <Link className="text-[#E1306C]" href={providerHref}>Provider profile</Link> : null}
        {row.serviceId ? <Link className="text-[#E1306C]" href={`/services/${row.serviceId}`}>Service overview</Link> : null}
      </div>
    </SheetCard>
  )
}
