"use client"

import { useEffect, useState } from "react"
import { ZodError } from "zod"
import { toast } from "sonner"
import { GradientButton, Modal, Page, StatusText, TextField } from "@/components/crm/ui"
import { ListSearch } from "@/components/crm/person-bits"
import { loadTeam } from "@/lib/load-admin"
import { createTeamMember, setPersonActive } from "@/lib/services/admin"
import type { Member } from "@/lib/types"

export function TeamView() {
  const [team, setTeam] = useState<Member[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)

  function refresh() {
    setLoading(true)
    setError("")
    loadTeam()
      .then(setTeam)
      .catch(() => setError("Could not load team."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // Load data when the page opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- starting a fetch needs loading flags
    refresh()
  }, [])

  async function toggleActive(row: Member) {
    try {
      await setPersonActive(row.id, row.status !== "Active")
      setTeam((list) =>
        list.map((item) =>
          item.id === row.id ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" } : item,
        ),
      )
    } catch {
      // Keep current row.
    }
  }

  const needle = query.trim().toLowerCase()
  const rows = needle
    ? team.filter((row) => `${row.name} ${row.email} ${row.phone} ${row.city} ${row.place}`.toLowerCase().includes(needle))
    : team

  return (
    <Page title="Team" action={<GradientButton onClick={() => setOpen(true)}>Add member</GradientButton>}>
      <p className="mb-5 max-w-2xl text-sm text-[#B4B4B4]">
        Team members log in on the website with this email and password. Assign them from a booking.
      </p>

      {loading ? <p className="mb-4 text-sm text-[#B4B4B4]">Loading team…</p> : null}
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
          <h2 className="text-lg font-semibold text-white">Team</h2>
          <ListSearch value={query} onChange={setQuery} />
        </div>
        <div className="pink-scroll overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="text-[#B4B4B4]">
                {["Name", "Phone", "Email", "City", "Place", "Status", "Action"].map((head) => (
                  <th key={head} className="px-3 py-3 font-medium">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-white/8 text-white">
                  <td className="px-3 py-4">{row.name}</td>
                  <td className="px-3 py-4">{row.phone || "—"}</td>
                  <td className="px-3 py-4">{row.email || "—"}</td>
                  <td className="px-3 py-4">{row.city || "—"}</td>
                  <td className="px-3 py-4">{row.place || "—"}</td>
                  <td className="px-3 py-4">
                    <StatusText value={row.status} />
                  </td>
                  <td className="px-3 py-4 text-right">
                    <button
                      type="button"
                      className="mr-3 text-[#E1306C]"
                      onClick={() => toast.message(`${row.name} · ${row.city} · ${row.place}`)}
                    >
                      View
                    </button>
                    <button type="button" className="text-[#B4B4B4] hover:text-white" onClick={() => void toggleActive(row)}>
                      {row.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
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

      <Modal open={open} onClose={() => setOpen(false)} wide>
        <MemberFields
          key={open ? "open" : "closed"}
          onCreate={async (body) => {
            await createTeamMember(body)
            toast.success("Team member added.")
            setOpen(false)
            refresh()
          }}
        />
      </Modal>
    </Page>
  )
}

function MemberFields({
  onCreate,
}: {
  onCreate: (body: {
    fullName: string
    phone?: string
    email: string
    password: string
    city: string
    place: string
  }) => Promise<void>
}) {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [city, setCity] = useState("")
  const [place, setPlace] = useState("")
  const [formError, setFormError] = useState("")
  const [pending, setPending] = useState(false)

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault()
        setFormError("")
        setPending(true)
        onCreate({
          fullName,
          phone: phone.trim() || undefined,
          email,
          password,
          city,
          place,
        })
          .catch((caught) => {
            if (caught instanceof ZodError) setFormError(caught.issues[0]?.message ?? "Check the form.")
            else setFormError("Could not create team member.")
          })
          .finally(() => setPending(false))
      }}
    >
      <TextField label="Name" value={fullName} placeholder="Ravi Shah" onChange={setFullName} />
      <TextField label="Phone" value={phone} placeholder="9876543210" onChange={setPhone} />
      <TextField label="Email" value={email} placeholder="ravi@relora.app" onChange={setEmail} />
      <TextField label="Password" value={password} placeholder="Password1!" type="password" onChange={setPassword} />
      <TextField label="City" value={city} placeholder="Mumbai" onChange={setCity} />
      <div className="md:col-span-2">
        <TextField label="Place" value={place} placeholder="Andheri west" onChange={setPlace} />
      </div>
      {formError ? <p className="text-sm text-[#E1306C] md:col-span-2">{formError}</p> : null}
      <div className="md:col-span-2 flex justify-center">
        <GradientButton type="submit" className="w-40">
          {pending ? "Saving…" : "Create"}
        </GradientButton>
      </div>
    </form>
  )
}
