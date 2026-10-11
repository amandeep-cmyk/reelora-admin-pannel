"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Facts, Pill, SheetCard, StatusText } from "@/components/crm/ui"
import { formatDate, formatInr } from "@/lib/money"
import type { Booking } from "@/lib/types"
import type { Review } from "@/lib/schemas/review.schema"
import { getAdminReviews } from "@/lib/services/review"

// Drops empty label/value pairs from a profile list.
export function filled(items: { label: string; value: string }[]) {
  return items.filter((item) => item.value.trim())
}

// Loads reviews for a client or provider.
export function useReviews(query: { clientId?: string; providerId?: string } | null) {
  const [reviews, setReviews] = useState<Review[]>([])
  const clientId = query?.clientId
  const providerId = query?.providerId

  useEffect(() => {
    if (!clientId && !providerId) return
    let live = true
    getAdminReviews(clientId ? { clientId } : { providerId })
      .then((page) => {
        if (live) setReviews(page.data)
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [clientId, providerId])

  return reviews
}

export function ProfileHead({ photo, name, role }: { photo: string; name: string; role: string }) {
  const src = photo.startsWith("http") || photo.startsWith("/") ? photo : ""
  return (
    <div className="flex items-center gap-4">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-[72px] rounded-full object-cover" />
      ) : (
        <div className="flex size-[72px] items-center justify-center rounded-full bg-[#333] text-2xl">{name.slice(0, 1)}</div>
      )}
      <div>
        <p className="text-2xl font-semibold">{name}</p>
        <div className="mt-1">
          <Pill>{role}</Pill>
        </div>
      </div>
    </div>
  )
}

export function About({ text }: { text: string }) {
  return (
    <div className="mt-6">
      <h2 className="mb-2 text-lg font-semibold">About</h2>
      <p className="max-w-3xl text-sm leading-6 text-[#d7d7d7]">{text}</p>
    </div>
  )
}

export function BookingHistory({ rows }: { rows: Booking[] }) {
  return (
    <SheetCard>
      <h2 className="mb-4 text-lg font-semibold">Bookings</h2>
      <div className="pink-scroll overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="text-[#B4B4B4]">
            <tr>
              {["Service", "Category", "Date", "Amount", "Status"].map((column) => (
                <th key={column} className="px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-t border-white/8">
                <td className="px-4 py-3">
                  <Link href={`/bookings/${item.id}`} className="hover:text-[#E1306C]">
                    {item.title}
                  </Link>
                </td>
                <td className="px-4 py-3">{item.category || "—"}</td>
                <td className="px-4 py-3">{formatDate(item.start)}</td>
                <td className="px-4 py-3">{item.budgetPaise ? formatInr(item.budgetPaise) : "—"}</td>
                <td className="px-4 py-3">
                  <StatusText value={item.status} />
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-[#B4B4B4]">
                  No bookings yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </SheetCard>
  )
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <SheetCard>
      <h2 className="mb-4 text-lg font-semibold">Reviews</h2>
      <div className="grid gap-3">
        {reviews.map((review) => (
          <div key={review._id} className="rounded-2xl bg-[#2a2a2a] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{review.reviewer.name}</p>
              <span className="text-sm text-[#F77737]">
                {review.stars} / 5 · {review.direction}
              </span>
            </div>
            {review.comment ? <p className="mt-2 text-sm leading-6 text-[#d7d7d7]">{review.comment}</p> : null}
            <p className="mt-2 text-xs text-[#B4B4B4]">{formatDate(review.createdAt)}</p>
          </div>
        ))}
        {reviews.length === 0 ? <p className="text-sm text-[#B4B4B4]">No reviews yet.</p> : null}
      </div>
    </SheetCard>
  )
}

// Plain search box used above list tables.
export function ListSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search"
      className="mb-4 h-10 w-52 rounded-full border border-white/10 bg-[#2a2a2a] px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#E1306C]"
    />
  )
}

export { Facts }
