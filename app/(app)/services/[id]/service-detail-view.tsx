"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Star } from "lucide-react"
import { BackTitle, Facts, Missing, Pill, SheetCard, StatusText } from "@/components/crm/ui"
import { formatDate, formatInr } from "@/lib/money"
import { loadBookings } from "@/lib/load-admin"
import type { AdminServiceDetail } from "@/lib/schemas/admin.schema"
import type { Review } from "@/lib/schemas/review.schema"
import { getAdminService } from "@/lib/services/admin"
import { getAdminReviews } from "@/lib/services/review"

export function ServiceDetailView() {
  const params = useParams<{ id: string }>()
  const [detail, setDetail] = useState<AdminServiceDetail | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [bookingCount, setBookingCount] = useState(0)
  const [missing, setMissing] = useState(false)

  // Load one service, its reviews, and how many bookings it has.
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
    loadBookings()
      .then((bookings) => {
        if (live) setBookingCount(bookings.filter((item) => item.serviceId === params.id).length)
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [params.id])

  if (missing) return <Missing href="/services" label="Services" />
  if (!detail) return <p className="text-sm text-[#B4B4B4]">Loading service…</p>

  const service = detail.service
  const owner = detail.owner
  const ownerHref = owner
    ? owner.role === "vendor" || service.ownerRole === "vendor"
      ? `/vendors/${owner._id}`
      : `/talents/${owner._id}`
    : ""
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
          <Mini label="Bookings" value={String(bookingCount)} />
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
          {ownerHref ? (
            <Link href={ownerHref} className="mt-4 inline-block text-sm text-[#E1306C]">
              Open {owner?.fullName}
            </Link>
          ) : null}
        </div>
      </SheetCard>

      <SheetCard>
        <h2 className="mb-4 text-lg font-semibold">Working days</h2>
        <div className="pink-scroll overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-[#B4B4B4]">
              <tr>
                {["Date", "Start", "End", "Status"].map((head) => (
                  <th key={head} className="px-4 py-3 font-medium">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detail.slots.map((slot) => (
                <tr key={slot._id} className="border-t border-white/8">
                  <td className="px-4 py-3">{formatDate(slot.date)}</td>
                  <td className="px-4 py-3">{slot.startAt.slice(11, 16)}</td>
                  <td className="px-4 py-3">{slot.endAt.slice(11, 16)}</td>
                  <td className="px-4 py-3">
                    <StatusText value={slot.status} />
                  </td>
                </tr>
              ))}
              {detail.slots.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-[#B4B4B4]">
                    No days saved.
                  </td>
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
