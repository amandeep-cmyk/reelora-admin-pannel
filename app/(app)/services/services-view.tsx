"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package } from "lucide-react"
import { Page, StatCard, StatusText } from "@/components/crm/ui"
import { ListSearch } from "@/components/crm/person-bits"
import { formatInr } from "@/lib/money"
import { loadBookings, loadServices } from "@/lib/load-admin"
import type { Service } from "@/lib/types"

export function ServicesView() {
  const [services, setServices] = useState<Service[]>([])
  const [bookingCount, setBookingCount] = useState(0)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  function refresh() {
    setLoading(true)
    setError("")
    Promise.all([loadServices(), loadBookings()])
      .then(([nextServices, bookings]) => {
        setServices(nextServices)
        setBookingCount(bookings.length)
      })
      .catch(() => setError("Could not load services."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // Load data when the page opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- starting a fetch needs loading flags
    refresh()
  }, [])

  const published = services.filter((item) => item.listingStatus === "published").length
  const needle = query.trim().toLowerCase()
  const rows = needle
    ? services.filter((row) => `${row.title} ${row.category} ${row.city}`.toLowerCase().includes(needle))
    : services

  return (
    <Page title="Services">
      <div className="mb-6 grid max-w-3xl gap-4 sm:grid-cols-3">
        <StatCard icon={Package} value={String(services.length)} label="Services" />
        <StatCard icon={Package} value={String(published)} label="Published" />
        <StatCard icon={Package} value={String(bookingCount)} label="Bookings" />
      </div>

      {loading ? <p className="mb-4 text-sm text-[#B4B4B4]">Loading services…</p> : null}
      {error ? (
        <p className="mb-4 text-sm text-[#E1306C]">
          {error}{" "}
          <button type="button" className="underline" onClick={refresh}>
            Retry
          </button>
        </p>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-4 md:p-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">All services</h2>
          <ListSearch value={query} onChange={setQuery} />
        </div>
        <div className="pink-scroll overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="text-[#B4B4B4]">
                {["Service", "Owner", "Category", "Price", "Rating", "Listing", "Action"].map((head) => (
                  <th key={head} className="px-3 py-3 font-medium">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-white/8 text-white">
                  <td className="px-3 py-4">
                    <Link href={`/services/${row.id}`} className="hover:text-[#E1306C]">
                      {row.title}
                    </Link>
                  </td>
                  <td className="px-3 py-4">{row.ownerName || "—"}</td>
                  <td className="px-3 py-4">{row.category || "—"}</td>
                  <td className="px-3 py-4">{row.pricePaise ? `${formatInr(row.pricePaise)} / day` : "—"}</td>
                  <td className="px-3 py-4">
                    {row.ratingCount ? `${row.ratingAverage?.toFixed(1)} (${row.ratingCount})` : "—"}
                  </td>
                  <td className="px-3 py-4">
                    <StatusText value={row.listingStatus || "draft"} />
                  </td>
                  <td className="px-3 py-4 text-right">
                    <Link href={`/services/${row.id}`} className="text-[#E1306C]">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-[#B4B4B4]">
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
