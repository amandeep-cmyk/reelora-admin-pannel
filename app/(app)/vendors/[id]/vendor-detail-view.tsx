"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { BackTitle, Facts, Missing, SheetCard } from "@/components/crm/ui"
import {
  About,
  BookingHistory,
  filled,
  ProfileHead,
  ReviewList,
  useReviews,
} from "@/components/crm/person-bits"
import { formatDate } from "@/lib/money"
import { loadBookings, loadServices, loadVendors } from "@/lib/load-admin"
import type { Booking, Service, Vendor } from "@/lib/types"

export function VendorDetailView() {
  const params = useParams<{ id: string }>()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [owned, setOwned] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)
  const reviews = useReviews(vendor ? { providerId: vendor.id } : null)

  useEffect(() => {
    let live = true
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset loading when the id changes
    setLoading(true)
    Promise.all([loadVendors(), loadBookings(), loadServices()])
      .then(([vendors, allBookings, services]) => {
        if (!live) return
        const found = vendors.find((item) => item.id === params.id) ?? null
        if (!found) {
          setMissing(true)
          return
        }
        setVendor(found)
        setBookings(allBookings.filter((item) => item.vendorId === found.id))
        setOwned(services.filter((item) => item.ownerType === "vendor" && item.ownerId === found.id))
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

  if (loading) return <p className="text-sm text-[#B4B4B4]">Loading vendor…</p>
  if (missing || !vendor) return <Missing href="/vendors" label="Vendors" />

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
      <BookingHistory rows={bookings} />
      <ReviewList reviews={reviews} />
    </>
  )
}
