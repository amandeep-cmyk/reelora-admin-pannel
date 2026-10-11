"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Page } from "@/components/crm/ui"
import { loadSearchIndex } from "@/lib/load-admin"

type Hit = { href: string; label: string; kind: string; meta: string }

export function SearchView() {
  const params = useSearchParams()
  const query = (params.get("q") ?? "").trim().toLowerCase()
  const [hits, setHits] = useState<Hit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const shown = query ? hits : []

  // Search across people, services, and bookings when the query changes.
  useEffect(() => {
    if (!query) {
      return
    }
    let live = true
    queueMicrotask(() => {
      if (live) {
        setLoading(true)
        setError("")
        setHits([])
      }
    })
    loadSearchIndex()
      .then((data) => {
        if (!live) return
        const next: Hit[] = []
        data.talents.forEach((item) => {
          if (`${item.name} ${item.category} ${item.location}`.toLowerCase().includes(query)) {
            next.push({ href: `/talents/${item.id}`, label: item.name, kind: "Talent", meta: item.location })
          }
        })
        data.vendors.forEach((item) => {
          if (`${item.name} ${item.city}`.toLowerCase().includes(query)) {
            next.push({ href: `/vendors/${item.id}`, label: item.name, kind: "Vendor", meta: item.city })
          }
        })
        data.clients.forEach((item) => {
          if (`${item.name} ${item.email} ${item.phone}`.toLowerCase().includes(query)) {
            next.push({ href: `/clients/${item.id}`, label: item.name, kind: "Client", meta: item.phone })
          }
        })
        data.services.forEach((item) => {
          if (`${item.title} ${item.category} ${item.city}`.toLowerCase().includes(query)) {
            next.push({ href: `/services/${item.id}`, label: item.title, kind: "Service", meta: item.category })
          }
        })
        data.bookings.forEach((item) => {
          if (`${item.title} ${item.clientName} ${item.category}`.toLowerCase().includes(query)) {
            next.push({ href: `/bookings/${item.id}`, label: item.title, kind: "Booking", meta: item.clientName })
          }
        })
        setHits(next)
      })
      .catch(() => {
        if (live) setError("Search failed.")
      })
      .finally(() => {
        if (live) setLoading(false)
      })
    return () => {
      live = false
    }
  }, [query])

  return (
    <Page title="Search">
      <p className="mb-4 text-sm text-[#B4B4B4]">{query ? `Results for “${query}”` : "Type in global search."}</p>
      {loading ? <p className="mb-4 text-sm text-[#B4B4B4]">Searching…</p> : null}
      {error ? <p className="mb-4 text-sm text-[#E1306C]">{error}</p> : null}
      <div className="grid gap-2">
        {shown.map((hit) => (
          <Link
            key={hit.href + hit.label}
            href={hit.href}
            className="flex items-center justify-between rounded-2xl bg-[#2a2a2a] px-4 py-3"
          >
            <span>
              <span className="block">{hit.label}</span>
              <span className="text-xs text-[#B4B4B4]">{hit.meta}</span>
            </span>
            <span className="text-sm text-[#E1306C]">{hit.kind}</span>
          </Link>
        ))}
        {query && !loading && shown.length === 0 ? <p className="text-sm text-[#B4B4B4]">No matches.</p> : null}
      </div>
    </Page>
  )
}
