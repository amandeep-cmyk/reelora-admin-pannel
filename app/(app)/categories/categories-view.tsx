"use client"

import { useEffect, useState } from "react"
import { GradientButton, Modal, Page, StatusText, TextField } from "@/components/crm/ui"
import { ListSearch } from "@/components/crm/person-bits"
import { loadCategories, loadServices } from "@/lib/load-admin"
import { createCategory, updateCategory } from "@/lib/services/admin"
import type { Category } from "@/lib/types"

function verticalLabel(verticals: Array<"shooting" | "events">) {
  const hasShooting = verticals.includes("shooting")
  const hasEvents = verticals.includes("events")
  if (hasShooting && hasEvents) return "Shooting · Events"
  if (hasEvents) return "Events"
  return "Shooting"
}

export function CategoriesView() {
  const [categories, setCategories] = useState<Category[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState("")
  const editing = categories.find((item) => item.id === editId) ?? null

  function refresh() {
    setLoading(true)
    setError("")
    Promise.all([loadCategories(), loadServices()])
      .then(([nextCategories, services]) => {
        setCategories(nextCategories)
        const map: Record<string, number> = {}
        services.forEach((item) => {
          map[item.category] = (map[item.category] ?? 0) + 1
        })
        setCounts(map)
      })
      .catch(() => setError("Could not load categories."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // Load data when the page opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- starting a fetch needs loading flags
    refresh()
  }, [])

  async function saveCategory(name: string, verticals: Array<"shooting" | "events">, icon: string) {
    if (editing) {
      const result = await updateCategory(editing.id, { name, verticals, icon })
      setCategories((list) =>
        list.map((item) =>
          item.id === editing.id
            ? {
                ...item,
                name: result.data.name,
                icon: result.data.icon || "",
                verticals: result.data.verticals?.length
                  ? result.data.verticals
                  : ["shooting", "events"],
              }
            : item,
        ),
      )
    } else {
      const result = await createCategory(name, verticals, icon)
      const created: Category = {
        id: result.data._id,
        name: result.data.name,
        icon: result.data.icon || "",
        status: result.data.isActive ? "Active" : "Inactive",
        verticals: result.data.verticals?.length ? result.data.verticals : ["shooting", "events"],
      }
      setCategories((list) => [...list, created].sort((a, b) => a.name.localeCompare(b.name)))
    }
    setOpen(false)
    setEditId("")
  }

  async function toggleActive(row: Category) {
    try {
      const result = await updateCategory(row.id, { isActive: row.status !== "Active" })
      const status: Category["status"] = result.data.isActive ? "Active" : "Inactive"
      setCategories((list) => list.map((item) => (item.id === row.id ? { ...item, status } : item)))
    } catch {
      // Keep current row.
    }
  }

  const needle = query.trim().toLowerCase()
  const rows = needle ? categories.filter((row) => row.name.toLowerCase().includes(needle)) : categories

  return (
    <Page title="Categories" action={<GradientButton onClick={() => setOpen(true)}>Add Category</GradientButton>}>
      <p className="mb-5 max-w-2xl text-sm text-[#B4B4B4]">
        Active categories are the ones providers can choose on a service. Assign each category to
        Shooting, Events, or both.
      </p>

      {loading ? <p className="mb-4 text-sm text-[#B4B4B4]">Loading categories…</p> : null}
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
          <h2 className="text-lg font-semibold text-white">All categories</h2>
          <ListSearch value={query} onChange={setQuery} />
        </div>
        <div className="pink-scroll overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-[#B4B4B4]">
                {["Icon", "Name", "Verticals", "Listings", "Status", "Action"].map((head) => (
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
                    {row.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={row.icon} alt="" className="h-8 w-8 object-contain" />
                    ) : null}
                  </td>
                  <td className="px-3 py-4">{row.name}</td>
                  <td className="px-3 py-4 text-[#B4B4B4]">{verticalLabel(row.verticals)}</td>
                  <td className="px-3 py-4">{String(counts[row.name] ?? 0)}</td>
                  <td className="px-3 py-4">
                    <StatusText value={row.status} />
                  </td>
                  <td className="px-3 py-4 text-right">
                    <button type="button" className="mr-3 text-[#E1306C]" onClick={() => setEditId(row.id)}>
                      Edit
                    </button>
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

      <Modal
        open={open || Boolean(editing)}
        onClose={() => {
          setOpen(false)
          setEditId("")
        }}
      >
        <CategoryFields
          key={editing?.id || "new"}
          title={editing ? "Edit category" : "Add category"}
          initialName={editing?.name ?? ""}
          initialVerticals={editing?.verticals ?? ["shooting", "events"]}
          initialIcon={editing?.icon ?? ""}
          onSubmit={(name, verticals, icon) => {
            void saveCategory(name, verticals, icon).catch(() => {})
          }}
        />
      </Modal>
    </Page>
  )
}

function CategoryFields({
  title,
  initialName,
  initialVerticals,
  initialIcon,
  onSubmit,
}: {
  title: string
  initialName: string
  initialVerticals: Array<"shooting" | "events">
  initialIcon: string
  onSubmit: (name: string, verticals: Array<"shooting" | "events">, icon: string) => void
}) {
  const [name, setName] = useState(initialName)
  const [icon, setIcon] = useState(initialIcon)
  const [shooting, setShooting] = useState(initialVerticals.includes("shooting"))
  const [events, setEvents] = useState(initialVerticals.includes("events"))

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (name.trim().length < 2) return
        const verticals: Array<"shooting" | "events"> = []
        if (shooting) verticals.push("shooting")
        if (events) verticals.push("events")
        if (verticals.length === 0) return
        onSubmit(name.trim(), verticals, icon.trim())
      }}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <TextField label="Name" value={name} placeholder="Drone pilots" onChange={setName} />
      <TextField
        label="Icon PNG path"
        value={icon}
        placeholder="/category-icons/cameras.png"
        onChange={setIcon}
      />
      {icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={icon} alt="" className="h-10 w-10 object-contain" />
      ) : null}
      <fieldset className="grid gap-2">
        <legend className="text-sm text-[#B4B4B4]">Verticals</legend>
        <label className="flex items-center gap-2 text-sm text-white">
          <input type="checkbox" checked={shooting} onChange={(event) => setShooting(event.target.checked)} />
          Shooting
        </label>
        <label className="flex items-center gap-2 text-sm text-white">
          <input type="checkbox" checked={events} onChange={(event) => setEvents(event.target.checked)} />
          Events
        </label>
        {!shooting && !events ? (
          <p className="text-xs text-[#E1306C]">Pick at least one vertical.</p>
        ) : null}
      </fieldset>
      <GradientButton type="submit" className="mx-auto mt-2 w-40">
        Save
      </GradientButton>
    </form>
  )
}
