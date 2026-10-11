"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users } from "lucide-react"
import { Page, StatCard, StatusText } from "@/components/crm/ui"
import { ListSearch } from "@/components/crm/person-bits"
import { formatDate } from "@/lib/money"
import { loadClients } from "@/lib/load-admin"
import { setPersonActive } from "@/lib/services/admin"
import type { Client } from "@/lib/types"

export function ClientsView() {
  const [clients, setClients] = useState<Client[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Load all clients when the page opens.
  function refresh() {
    setLoading(true)
    setError("")
    loadClients()
      .then(setClients)
      .catch(() => setError("Could not load clients."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // Load data when the page opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- starting a fetch needs loading flags
    refresh()
  }, [])

  // Turn a client on or off.
  async function toggleActive(client: Client) {
    try {
      await setPersonActive(client.id, client.status !== "Active")
      setClients((list) =>
        list.map((item) =>
          item.id === client.id ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" } : item,
        ),
      )
    } catch {
      // API layer already shows toast/errors when needed.
    }
  }

  const needle = query.trim().toLowerCase()
  const rows = needle
    ? clients.filter((row) => `${row.name} ${row.email} ${row.phone}`.toLowerCase().includes(needle))
    : clients
  const active = clients.filter((item) => item.status === "Active").length

  return (
    <Page title="Client Management">
      <div className="mb-6 grid max-w-2xl gap-4 sm:grid-cols-2">
        <StatCard icon={Users} value={String(clients.length)} label="Clients" />
        <StatCard icon={Users} value={String(active)} label="Active clients" />
      </div>

      {loading ? <p className="mb-4 text-sm text-[#B4B4B4]">Loading clients…</p> : null}
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
          <h2 className="text-lg font-semibold text-white">All clients</h2>
          <ListSearch value={query} onChange={setQuery} />
        </div>
        <div className="pink-scroll overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="text-[#B4B4B4]">
                {["Name", "Registered", "Email", "Phone", "Status", "Action"].map((head) => (
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
                    <Link className="hover:text-[#E1306C]" href={`/clients/${row.id}`}>
                      {row.name}
                    </Link>
                  </td>
                  <td className="px-3 py-4">{formatDate(row.registeredOn)}</td>
                  <td className="px-3 py-4">{row.email || "—"}</td>
                  <td className="px-3 py-4">{row.phone || "—"}</td>
                  <td className="px-3 py-4">
                    <StatusText value={row.status} />
                  </td>
                  <td className="px-3 py-4 text-right">
                    <Link href={`/clients/${row.id}`} className="mr-3 text-[#E1306C]">
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
                  <td colSpan={6} className="px-3 py-10 text-[#B4B4B4]">
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
