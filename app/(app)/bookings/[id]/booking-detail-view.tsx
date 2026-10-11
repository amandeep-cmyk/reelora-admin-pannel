"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { BackTitle, Facts, Missing, Pill, SheetCard, StatusText } from "@/components/crm/ui"
import { Button } from "@/components/ui/button"
import { formatDate, formatInr } from "@/lib/money"
import { loadBookings, loadTeam } from "@/lib/load-admin"
import { assignBooking, setBookingStatus } from "@/lib/services/admin"
import { bookingStatuses, type BookingStatus } from "@/lib/schemas/admin.schema"
import type { Booking, Member } from "@/lib/types"
import { mapBooking } from "@/lib/map"

export function BookingDetailView() {
  const params = useParams<{ id: string }>()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [team, setTeam] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)
  const [memberId, setMemberId] = useState("")
  const [status, setStatus] = useState("")
  const [pending, setPending] = useState("")

  // Load this booking and the team list for assignment.
  useEffect(() => {
    let live = true
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset loading when the id changes
    setLoading(true)
    Promise.all([loadBookings(), loadTeam()])
      .then(([bookings, members]) => {
        if (!live) return
        const found = bookings.find((item) => item.id === params.id) ?? null
        if (!found) {
          setMissing(true)
          return
        }
        setBooking(found)
        setTeam(members)
      })
      .catch(() => {
        if (live) setMissing(true)
      })
      .finally(() => {
        if (live) setLoading(false)
      })
    return () => {
      live = false
    }
  }, [params.id])

  if (loading) return <p className="text-sm text-[#B4B4B4]">Loading booking…</p>
  if (missing || !booking) return <Missing href="/bookings" label="Bookings" />

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
      const result = await assignBooking(row.id, selectedMember)
      setBooking(mapBooking(result.data))
      toast.success("Team member assigned.")
      setMemberId("")
    } catch {
      // Request layer may already show the error.
    } finally {
      setPending("")
    }
  }

  async function onStatus() {
    if (!bookingStatuses.includes(selectedStatus as BookingStatus)) return
    setPending("status")
    try {
      await setBookingStatus(row.id, selectedStatus as BookingStatus)
      setBooking({ ...row, status: selectedStatus })
      toast.success("Booking status updated.")
      setStatus("")
    } catch {
      // Request layer may already show the error.
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
          <div className="mt-1">
            <Pill>{row.category || providerName}</Pill>
          </div>
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
              <option key={item.id} value={item.id}>
                {item.name} · {item.city}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="gradient"
            className="mt-3"
            disabled={!selectedMember || pending === "assign"}
            onClick={() => void onAssign()}
          >
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
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-[#B4B4B4]">Cancelling a paid booking starts a refund.</p>
          <Button type="button" variant="gradient" className="mt-3" disabled={pending === "status"} onClick={() => void onStatus()}>
            Save status
          </Button>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        {row.clientId ? (
          <Link className="text-[#E1306C]" href={`/clients/${row.clientId}`}>
            Client profile
          </Link>
        ) : null}
        {providerHref ? (
          <Link className="text-[#E1306C]" href={providerHref}>
            Provider profile
          </Link>
        ) : null}
        {row.serviceId ? (
          <Link className="text-[#E1306C]" href={`/services/${row.serviceId}`}>
            Service overview
          </Link>
        ) : null}
      </div>
    </SheetCard>
  )
}
