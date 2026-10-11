"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users } from "lucide-react"
import { Page, StatCard, StatusText } from "@/components/crm/ui"
import { ListSearch } from "@/components/crm/person-bits"
import { loadTalents } from "@/lib/load-admin"
import { setPersonActive } from "@/lib/services/admin"
import type { Talent } from "@/lib/types"

export function TalentsView() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  function refresh() {
    setLoading(true)
    setError("")
    loadTalents()
      .then(setTalents)
      .catch(() => setError("Could not load talents."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // Load data when the page opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- starting a fetch needs loading flags
    refresh()
  }, [])

  async function toggleActive(talent: Talent) {
    try {
      await setPersonActive(talent.id, talent.status !== "Active")
      setTalents((list) =>
        list.map((item) =>
          item.id === talent.id ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" } : item,
        ),
      )
    } catch {
      // Ignore; keep table as-is.
    }
  }

  const needle = query.trim().toLowerCase()
  const rows = needle
    ? talents.filter((row) =>
        `${row.name} ${row.email} ${row.category} ${row.phone} ${row.location}`.toLowerCase().includes(needle),
      )
    : talents

  return (
    <Page title="Talent Management">
      <div className="mb-6 max-w-xs">
        <StatCard icon={Users} value={String(talents.length)} label="Talents" />
      </div>

      {loading ? <p className="mb-4 text-sm text-[#B4B4B4]">Loading talents…</p> : null}
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
          <h2 className="text-lg font-semibold text-white">All talents</h2>
          <ListSearch value={query} onChange={setQuery} />
        </div>
        <div className="pink-scroll overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="text-[#B4B4B4]">
                {["Name", "Title", "City", "Email", "Phone", "Payout", "Status", "Action"].map((head) => (
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
                    <Link className="hover:text-[#E1306C]" href={`/talents/${row.id}`}>
                      {row.name}
                    </Link>
                  </td>
                  <td className="px-3 py-4">{row.tagline || "—"}</td>
                  <td className="px-3 py-4">{row.location || "—"}</td>
                  <td className="px-3 py-4">{row.email || "—"}</td>
                  <td className="px-3 py-4">{row.phone || "—"}</td>
                  <td className="px-3 py-4">{row.payout || "—"}</td>
                  <td className="px-3 py-4">
                    <StatusText value={row.status} />
                  </td>
                  <td className="px-3 py-4 text-right">
                    <Link href={`/talents/${row.id}`} className="mr-3 text-[#E1306C]">
                      View
                    </Link>
                    <button type="button" className="text-[#B4B4B4] hover:text-white" onClick={() => void toggleActive(row)}>
                      {row.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && !loading ? (
                <tr>
                  <td colSpan={8} className="px-3 py-10 text-[#B4B4B4]">
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
