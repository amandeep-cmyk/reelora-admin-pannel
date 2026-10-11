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
import { loadBookings, loadServices, loadTalents } from "@/lib/load-admin"
import type { Booking, Service, Talent } from "@/lib/types"

export function TalentDetailView() {
  const params = useParams<{ id: string }>()
  const [talent, setTalent] = useState<Talent | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [owned, setOwned] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)
  const reviews = useReviews(talent ? { providerId: talent.id } : null)

  useEffect(() => {
    let live = true
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset loading when the id changes
    setLoading(true)
    Promise.all([loadTalents(), loadBookings(), loadServices()])
      .then(([talents, allBookings, services]) => {
        if (!live) return
        const found = talents.find((item) => item.id === params.id) ?? null
        if (!found) {
          setMissing(true)
          return
        }
        setTalent(found)
        setBookings(allBookings.filter((item) => item.talentId === found.id))
        setOwned(services.filter((item) => item.ownerType === "talent" && item.ownerId === found.id))
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

  if (loading) return <p className="text-sm text-[#B4B4B4]">Loading talent…</p>
  if (missing || !talent) return <Missing href="/talents" label="Talents" />

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
      <BookingHistory rows={bookings} />
      <ReviewList reviews={reviews} />
    </>
  )
}
