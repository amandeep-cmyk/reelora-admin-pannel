"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarDays, Shield, Store, Users, Wallet } from "lucide-react"
import { Page, StatCard, StatusText } from "@/components/crm/ui"
import { formatDate, formatInr } from "@/lib/money"
import type { AdminDashboard } from "@/lib/schemas/admin.schema"
import { getAdminDashboard } from "@/lib/services/admin"
import { loadBookings } from "@/lib/load-admin"
import type { Booking } from "@/lib/types"

const ranges = ["All time", "This month", "Last 30 days", "This year"] as const

// Builds from/to dates for the dashboard API.
function rangeQuery(range: (typeof ranges)[number]) {
  const now = new Date()
  const iso = (date: Date) => date.toISOString().slice(0, 10)
  if (range === "All time") return {}
  if (range === "Last 30 days") {
    const from = new Date(now)
    from.setDate(from.getDate() - 30)
    return { from: iso(from), to: iso(now) }
  }
  if (range === "This year") return { from: `${now.getFullYear()}-01-01`, to: iso(now) }
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return { from: `${now.getFullYear()}-${month}-01`, to: iso(now) }
}

export function DashboardView() {
  const [range, setRange] = useState<(typeof ranges)[number]>("All time")
  const [segment, setSegment] = useState<"Clients" | "Talents" | "Vendors" | "Team">("Clients")
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [failed, setFailed] = useState(false)

  // Load summary numbers when the date range changes.
  useEffect(() => {
    let live = true
    getAdminDashboard(rangeQuery(range))
      .then((data) => {
        if (live) setDashboard(data)
      })
      .catch(() => {
        if (live) setFailed(true)
      })
    return () => {
      live = false
    }
  }, [range])

  // Load recent bookings once for the bottom table.
  useEffect(() => {
    let live = true
    loadBookings()
      .then((rows) => {
        if (live) setBookings(rows)
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [])

  const people = dashboard?.people
  const money = dashboard?.money
  const segments = {
    Clients: people?.clients ?? 0,
    Talents: people?.talents ?? 0,
    Vendors: people?.vendors ?? 0,
    Team: people?.team ?? 0,
  }
  const peopleTotal = segments.Clients + segments.Talents + segments.Vendors + segments.Team
  const maxCategory = dashboard?.categories[0]?.bookings || 1

  return (
    <Page title="Dashboard">
      <div className="mb-5 max-w-xs">
        <label className="block">
          <span className="mb-1 block text-xs text-[#B4B4B4]">Range</span>
          <select
            value={range}
            onChange={(event) => setRange(event.target.value as typeof range)}
            className="h-10 w-full rounded-full border border-white/10 bg-[#2a2a2a] px-3 text-sm outline-none"
          >
            {ranges.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      {failed ? <p className="mb-4 text-sm text-[#E1306C]">The dashboard could not be loaded.</p> : null}
      {!dashboard && !failed ? <p className="mb-4 text-sm text-[#B4B4B4]">Loading dashboard…</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} value={String(people?.clients ?? 0)} label="Clients" />
        <StatCard icon={Shield} value={String(people?.talents ?? 0)} label="Talents" />
        <StatCard icon={Store} value={String(people?.vendors ?? 0)} label="Vendors" />
        <StatCard icon={Users} value={String(people?.team ?? 0)} label="Team members" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} value={formatInr(money?.finishedBookingPaise ?? 0)} label="Finished booking value" hint="Completed and settled" />
        <StatCard icon={Wallet} value={formatInr(money?.commissionPaise ?? 0)} label="Platform share · 20%" />
        <StatCard icon={Wallet} value={formatInr(money?.payoutsPendingPaise ?? 0)} label="Provider share pending" />
        <StatCard
          icon={CalendarDays}
          value={String(dashboard?.bookings.byStatus.reduce((sum, item) => sum + item.count, 0) ?? 0)}
          label="Bookings in range"
          hint={`${dashboard?.bookings.cancellations ?? 0} cancelled`}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl bg-[#2a2a2a] p-5">
          <h2 className="text-lg font-semibold">Bookings over time</h2>
          <TrendChart rows={dashboard?.bookings.byMonth ?? []} />
        </div>
        <div className="rounded-2xl bg-[#2a2a2a] p-5">
          <h2 className="text-lg font-semibold">People</h2>
          <div className="mt-3 flex justify-center">
            <select
              value={segment}
              onChange={(event) => setSegment(event.target.value as typeof segment)}
              className="h-9 rounded-full border border-white/10 bg-[#1f1f1f] px-4 text-sm"
            >
              {Object.keys(segments).map((key) => (
                <option key={key}>{key}</option>
              ))}
            </select>
          </div>
          <Donut value={segments[segment]} total={peopleTotal || 1} />
          <p className="text-center text-sm text-[#B4B4B4]">
            Total: {peopleTotal} <span className="ml-4">{segment}: {segments[segment]}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl bg-[#2a2a2a] p-5">
          <h2 className="text-lg font-semibold">Bookings by category</h2>
          <p className="mt-1 text-sm text-[#B4B4B4]">
            {dashboard?.topCategory?.name
              ? `${dashboard.topCategory.name} leads with ${dashboard.topCategory.bookings ?? 0} bookings.`
              : "Paid bookings grouped by the listing category."}
          </p>
          <div className="mt-4 space-y-3">
            {(dashboard?.categories ?? []).map((item) => (
              <div key={item.categoryId || item.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{item.name || "Uncategorised"}</span>
                  <span className="text-[#B4B4B4]">
                    {item.bookings} bookings · {formatInr(item.totalPaise)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-1.5 rounded-full bg-[linear-gradient(90deg,#F77737,#E1306C,#405DE6)]"
                    style={{ width: `${Math.max(8, (item.bookings / maxCategory) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {dashboard && dashboard.categories.length === 0 ? (
              <p className="text-sm text-[#B4B4B4]">No category bookings in this range.</p>
            ) : null}
          </div>
        </div>
        <div className="rounded-2xl bg-[#2a2a2a] p-5">
          <h2 className="text-lg font-semibold">Where the money goes</h2>
          <p className="mt-1 text-sm text-[#B4B4B4]">Finished bookings only. The platform keeps 20%.</p>
          <Split label="Providers" amount={money?.payoutsPendingPaise ?? 0} total={money?.finishedBookingPaise ?? 0} />
          <Split label="Platform" amount={money?.commissionPaise ?? 0} total={money?.finishedBookingPaise ?? 0} />
          <div className="mt-5 space-y-2 text-sm">
            {(dashboard?.byField ?? []).map((item) => (
              <p key={item.ownerRole} className="flex justify-between capitalize">
                <span>{item.ownerRole}</span>
                <span className="text-[#B4B4B4]">
                  {item.bookings} bookings · {formatInr(item.totalPaise)}
                </span>
              </p>
            ))}
          </div>
          <Link href="/services" className="mt-4 inline-block text-sm text-[#E1306C]">
            View services
          </Link>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <RankList
          title="Top services"
          rows={(dashboard?.topServices ?? []).map((item) => ({
            id: item.serviceId,
            href: `/services/${item.serviceId}`,
            label: item.title,
            meta: `${item.category || item.ownerRole || "Service"} · ${item.bookings} bookings · ${formatInr(item.totalPaise)}`,
          }))}
        />
        <RankList
          title="Top service in each category"
          rows={(dashboard?.topServiceByCategory ?? []).map((item) => ({
            id: `${item.category}-${item.serviceId}`,
            href: `/services/${item.serviceId}`,
            label: item.title,
            meta: `${item.category} · ${item.bookings} bookings · ${formatInr(item.totalPaise)}`,
          }))}
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-lg font-semibold">Latest bookings</h2>
          <Link href="/bookings" className="text-sm text-[#E1306C]">
            All bookings
          </Link>
        </div>
        <div className="pink-scroll overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-[#B4B4B4]">
              <tr>
                {["Client", "Title", "Category", "Date", "Amount", "Status"].map((head) => (
                  <th key={head} className="px-5 py-3 font-medium">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 6).map((item) => (
                <tr key={item.id} className="border-t border-white/8">
                  <td className="px-5 py-3">{item.clientName}</td>
                  <td className="px-5 py-3">
                    <Link href={`/bookings/${item.id}`} className="hover:text-[#E1306C]">
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-[#B4B4B4]">{item.category || "—"}</td>
                  <td className="px-5 py-3">{formatDate(item.start)}</td>
                  <td className="px-5 py-3">{item.budgetPaise ? formatInr(item.budgetPaise) : "—"}</td>
                  <td className="px-5 py-3">
                    <StatusText value={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Page>
  )
}

function RankList({ title, rows }: { title: string; rows: { id: string; href: string; label: string; meta: string }[] }) {
  return (
    <div className="rounded-2xl bg-[#2a2a2a] p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <Link key={row.id} href={row.href} className="block rounded-xl bg-black/20 px-3 py-2 hover:bg-black/30">
            <p>{row.label}</p>
            <p className="text-xs text-[#B4B4B4]">{row.meta}</p>
          </Link>
        ))}
        {rows.length === 0 ? <p className="text-sm text-[#B4B4B4]">Nothing in this range.</p> : null}
      </div>
    </div>
  )
}

function Split({ label, amount, total }: { label: string; amount: number; total: number }) {
  const width = total > 0 ? Math.max(4, Math.round((amount / total) * 100)) : 0
  return (
    <div className="mt-4">
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-[#B4B4B4]">{formatInr(amount)}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-[linear-gradient(90deg,#F77737,#E1306C,#405DE6)]" style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

function TrendChart({ rows }: { rows: { month: string; count: number; totalPaise: number }[] }) {
  if (rows.length === 0) return <p className="mt-6 text-sm text-[#B4B4B4]">No bookings in this range.</p>
  const max = Math.max(...rows.map((item) => item.count), 1)
  const width = 520
  const height = 210
  const left = 36
  const bottom = 28
  const innerH = height - bottom - 12
  const step = (width - left - 12) / rows.length
  function y(value: number) {
    return 12 + innerH - (value / max) * innerH
  }
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 w-full">
      {rows.map((item, index) => {
        const x = left + index * step + 8
        const label = item.month.slice(5)
        return (
          <g key={item.month}>
            <rect x={x} y={y(item.count)} width="16" height={Math.max(2, y(0) - y(item.count))} rx="3" fill="#ffffff" />
            <text x={x + 8} y={height - 8} fill="#B4B4B4" fontSize="11" textAnchor="middle">
              {label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function Donut({ value, total }: { value: number; total: number }) {
  const radius = 68
  const circ = 2 * Math.PI * radius
  const dash = total > 0 ? circ * (value / total) : 0
  return (
    <svg viewBox="0 0 200 200" className="mx-auto my-2 size-52">
      <circle cx="100" cy="100" r={radius} fill="none" stroke="#3a3a3a" strokeWidth="16" />
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke="#405DE6"
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ - dash}`}
        transform="rotate(-90 100 100)"
      />
    </svg>
  )
}
