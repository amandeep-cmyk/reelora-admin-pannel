"use client"

import { useEffect, useState } from "react"
import { GradientButton, Modal, Page, StatusText, TextField } from "@/components/crm/ui"
import { ListSearch } from "@/components/crm/person-bits"
import { loadCategories, loadServices } from "@/lib/load-admin"
import { createCategory, updateCategory } from "@/lib/services/admin"
import type { Category } from "@/lib/types"

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

  async function saveName(name: string) {
    if (editing) {
      const result = await updateCategory(editing.id, { name })
      setCategories((list) => list.map((item) => (item.id === editing.id ? { ...item, name: result.data.name } : item)))
    } else {
      const result = await createCategory(name)
      const created: Category = {
        id: result.data._id,
        name: result.data.name,
        status: result.data.isActive ? "Active" : "Inactive",
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
      <p className="mb-5 max-w-2xl text-sm text-[#B4B4B4]">Active categories are the ones providers can choose on a service.</p>

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
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="text-[#B4B4B4]">
                {["Name", "Listings", "Status", "Action"].map((head) => (
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
                  <td className="px-3 py-4">{String(counts[row.name] ?? 0)}</td>
                  <td className="px-3 py-4">
                    <StatusText value={row.status} />
                  </td>
                  <td className="px-3 py-4 text-right">
                    <button type="button" className="mr-3 text-[#E1306C]" onClick={() => setEditId(row.id)}>
                      Rename
                    </button>
                    <button type="button" className="text-[#B4B4B4] hover:text-white" onClick={() => void toggleActive(row)}>
                      {row.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} className="px-3 py-10 text-[#B4B4B4]">
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
          title={editing ? "Rename category" : "Add category"}
          initialName={editing?.name ?? ""}
          onSubmit={(name) => {
            void saveName(name).catch(() => {})
          }}
        />
      </Modal>
    </Page>
  )
}

function CategoryFields({
  title,
  initialName,
  onSubmit,
}: {
  title: string
  initialName: string
  onSubmit: (name: string) => void
}) {
  const [name, setName] = useState(initialName)
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (name.trim().length < 2) return
        onSubmit(name.trim())
      }}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <TextField label="Name" value={name} placeholder="Drone pilots" onChange={setName} />
      <GradientButton type="submit" className="mx-auto mt-2 w-40">
        Save
      </GradientButton>
    </form>
  )
}
