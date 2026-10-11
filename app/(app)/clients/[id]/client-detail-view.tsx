"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { BackTitle, Facts, Missing, SheetCard } from "@/components/crm/ui"
import {
  BookingHistory,
  filled,
  ProfileHead,
  ReviewList,
  useReviews,
} from "@/components/crm/person-bits"
import { formatDate } from "@/lib/money"
import { loadBookings, loadClients } from "@/lib/load-admin"
import type { Booking, Client } from "@/lib/types"

export function ClientDetailView() {
  const params = useParams<{ id: string }>()
  const [client, setClient] = useState<Client | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)
  const reviews = useReviews(client ? { clientId: client.id } : null)

  // Load this client and their bookings.
  useEffect(() => {
    let live = true
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset loading when the id changes
    setLoading(true)
    Promise.all([loadClients(), loadBookings()])
      .then(([clients, allBookings]) => {
        if (!live) return
        const found = clients.find((item) => item.id === params.id) ?? null
        if (!found) {
          setMissing(true)
          return
        }
        setClient(found)
        setBookings(allBookings.filter((item) => item.clientId === found.id))
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

  if (loading) return <p className="text-sm text-[#B4B4B4]">Loading client…</p>
  if (missing || !client) return <Missing href="/clients" label="Clients" />

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
      <BookingHistory rows={bookings} />
      <ReviewList reviews={reviews} />
    </>
  )
}
