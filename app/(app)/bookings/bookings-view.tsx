"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarDays } from "lucide-react"
import { Page, StatCard, StatusText } from "@/components/crm/ui"
import { ListSearch } from "@/components/crm/person-bits"
import { formatDate, formatInr } from "@/lib/money"
import { loadBookings, loadTalents, loadVendors } from "@/lib/load-admin"
import { bookingStatuses } from "@/lib/schemas/admin.schema"
import type { Booking, Talent, Vendor } from "@/lib/types"

export function BookingsView() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [talents, setTalents] = useState<Talent[]>([])
  const [query, setQuery] = useState("")
  const [vendor, setVendor] = useState("All")
  const [talent, setTalent] = useState("All")
  const [category, setCategory] = useState("All")
  const [status, setStatus] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  function refresh() {
    setLoading(true)
    setError("")
    Promise.all([loadBookings(), loadVendors(), loadTalents()])
      .then(([nextBookings, nextVendors, nextTalents]) => {
        setBookings(nextBookings)
        setVendors(nextVendors)
        setTalents(nextTalents)
      })
      .catch(() => setError("Could not load bookings."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // Load data when the page opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- starting a fetch needs loading flags
    refresh()
  }, [])

  const categories = ["All", ...new Set(bookings.map((item) => item.category).filter(Boolean))]
  const needle = query.trim().toLowerCase()

  const rows = bookings.filter((item) => {
    if (vendor !== "All" && item.vendorId !== vendor) return false
    if (talent !== "All" && item.talentId !== talent) return false
    if (category !== "All" && item.category !== category) return false
    if (status !== "All" && item.status !== status) return false
    if (
      needle &&
      !`${item.clientName} ${item.title} ${item.category} ${item.shootLocation || ""} ${item.teamMemberName || ""}`
        .toLowerCase()
        .includes(needle)
    ) {
      return false
    }
    return true
  })

  return (
    <Page title="Bookings">
      <div className="mb-6 max-w-xs">
        <StatCard icon={CalendarDays} value={String(bookings.length)} label="Total bookings" />
      </div>

      {loading ? <p className="mb-4 text-sm text-[#B4B4B4]">Loading bookings…</p> : null}
      {error ? (
        <p className="mb-4 text-sm text-[#E1306C]">
          {error}{" "}
          <button type="button" className="underline" onClick={refresh}>
            Retry
          </button>
        </p>
      ) : null}

      <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MiniSelect
          value={vendor}
          onChange={setVendor}
          options={[{ id: "All", label: "Vendor" }, ...vendors.map((item) => ({ id: item.id, label: item.name }))]}
        />
        <MiniSelect
          value={talent}
          onChange={setTalent}
          options={[{ id: "All", label: "Talent" }, ...talents.map((item) => ({ id: item.id, label: item.name }))]}
        />
        <MiniSelect
          value={category}
          onChange={setCategory}
          options={categories.map((item) => ({ id: item, label: item === "All" ? "Category" : item }))}
        />
        <MiniSelect
          value={status}
          onChange={setStatus}
          options={[{ id: "All", label: "Status" }, ...bookingStatuses.map((item) => ({ id: item, label: item.replaceAll("_", " ") }))]}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-4 md:p-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">All bookings</h2>
          <ListSearch value={query} onChange={setQuery} />
        </div>
        <div className="pink-scroll overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="text-[#B4B4B4]">
                {["Client", "Service", "Category", "Shoot location", "Created", "Amount", "Team", "Status", "Action"].map(
                  (head) => (
                    <th key={head} className="px-3 py-3 font-medium">
                      {head}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-white/8 text-white">
                  <td className="px-3 py-4">{row.clientName}</td>
                  <td className="px-3 py-4">{row.title}</td>
                  <td className="px-3 py-4">{row.category || "—"}</td>
                  <td className="px-3 py-4">{row.shootLocation || "—"}</td>
                  <td className="px-3 py-4">{formatDate(row.start)}</td>
                  <td className="px-3 py-4">{row.budgetPaise ? formatInr(row.budgetPaise) : "—"}</td>
                  <td className="px-3 py-4">{row.teamMemberName || "Unassigned"}</td>
                  <td className="px-3 py-4">
                    <StatusText value={row.status} />
                  </td>
                  <td className="px-3 py-4 text-right">
                    <Link href={`/bookings/${row.id}`} className="text-[#E1306C]">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && !loading ? (
                <tr>
                  <td colSpan={9} className="px-3 py-10 text-[#B4B4B4]">
                    No matching records.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
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
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
