"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  Pencil,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "cn"

export function Page({
  title,
  children,
  action,
}: {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[#212121] p-5 md:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[28px] font-semibold tracking-tight text-white">{title}</h1>
        {action}
      </div>
      {children}
    </section>
  )
}

export function SheetCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("rounded-[28px] border border-white/10 bg-[#212121] p-5 md:p-7", className)}>
      {children}
    </section>
  )
}

export function StatCard({
  icon: Icon,
  value,
  label,
  hint,
}: {
  icon: LucideIcon
  value: string
  label: string
  hint?: string
}) {
  return (
    <div className="rounded-2xl bg-[#2a2a2a] px-5 py-5">
      <span className="mb-4 flex size-9 items-center justify-center rounded-full bg-black/40 text-white">
        <Icon className="size-4" />
      </span>
      <p className="text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-sm text-[#B4B4B4]">{label}</p>
      {hint ? <p className="mt-1 text-xs text-[#B4B4B4]">{hint}</p> : null}
    </div>
  )
}

export function StatusText({ value }: { value: string }) {
  const key = value.toLowerCase()
  const good = ["active", "approved", "booked", "completed", "confirmed", "confirmed_by_admin", "paid_upfront", "in_progress", "settled", "published"]
  const bad = ["inactive", "rejected", "cancelled", "refunded"]
  const tone = good.includes(key) ? "text-emerald-400" : bad.includes(key) ? "text-red-400" : "text-white"
  return <span className={cn("capitalize", tone)}>{value.replaceAll("_", " ")}</span>
}

export function BackTitle({ href, title }: { href: string; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <Link
        href={href}
        className="flex size-9 items-center justify-center rounded-full bg-[#2e2e2e] text-white hover:bg-[#3a3a3a]"
      >
        <ChevronLeft className="size-4" />
      </Link>
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
    </div>
  )
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[#333333] px-3 py-1 text-xs text-[#d0d0d0]">{children}</span>
  )
}

export function Facts({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid gap-y-3">
      {items.map((item) => (
        <div key={item.label} className="grid grid-cols-[148px_1fr] gap-3 text-sm">
          <p className="text-[#B4B4B4]">{item.label}</p>
          <p className="text-white">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-2">
      <Label className="font-normal text-[#B4B4B4]">{label}</Label>
      {children}
    </label>
  )
}

export function SelectInput({
  value,
  onChange,
  children,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 w-full rounded-xl border border-white/10 bg-[#1f1f1f] px-4 text-sm text-white outline-none focus:border-[#E1306C]"
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {children}
    </select>
  )
}

export function Modal({
  open,
  onClose,
  children,
  wide = false,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4" onClick={onClose}>
      <div
        className={cn(
          "max-h-[90vh] w-full overflow-y-auto rounded-3xl border border-white/10 bg-[#2a2a2a] p-6",
          wide ? "max-w-3xl" : "max-w-xl",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-2 flex justify-end">
          <button type="button" onClick={onClose} className="text-[#B4B4B4] hover:text-white" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Pager({
  page,
  pages,
  onPage,
}: {
  page: number
  pages: number
  onPage: (page: number) => void
}) {
  const items = useMemo(() => {
    if (pages <= 7) return Array.from({ length: pages }, (_, index) => index + 1)
    return [1, 2, 3, "…", pages - 2, pages - 1, pages] as const
  }, [pages])

  return (
    <div className="mt-4 flex items-center justify-end gap-1.5 text-sm text-[#B4B4B4]">
      <button
        type="button"
        onClick={() => onPage(Math.max(1, page - 1))}
        className="flex size-8 items-center justify-center rounded-lg border border-white/10 hover:text-white"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>
      {items.map((item, index) =>
        item === "…" ? (
          <span key={`gap-${index}`} className="px-1">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPage(item)}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg",
              page === item ? "bg-[#E1306C] text-white" : "hover:bg-white/5 hover:text-white",
            )}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onPage(Math.min(pages, page + 1))}
        className="flex size-8 items-center justify-center rounded-lg border border-white/10 hover:text-white"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}

export type RowAction<T> = {
  label: string
  icon: LucideIcon
  tone?: "default" | "danger" | "ok"
  href?: string
  onSelect?: (row: T) => void
  hidden?: (row: T) => boolean
}

export type Column<T> = {
  header: string
  cell: (row: T) => React.ReactNode
}

export function DataTable<T extends { id: string }>({
  title,
  rows,
  columns,
  searchText,
  actions,
  toolbar,
  pageSize = 6,
}: {
  title: string
  rows: T[]
  columns: Column<T>[]
  searchText: (row: T) => string
  actions?: (row: T) => RowAction<T>[]
  toolbar?: React.ReactNode
  pageSize?: number
}) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const needle = query.trim().toLowerCase()
  const filtered = needle ? rows.filter((row) => searchText(row).toLowerCase().includes(needle)) : rows
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pages)
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#B4B4B4]" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search"
              className="h-10 w-52 rounded-full border border-white/10 bg-[#2a2a2a] pr-4 pl-9 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#E1306C]"
            />
          </label>
          <span className="flex size-10 items-center justify-center rounded-full border border-white/10 text-[#B4B4B4]">
            <SlidersHorizontal className="size-4" />
          </span>
          {toolbar}
        </div>
      </div>
      <div className="pink-scroll overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="text-[#B4B4B4]">
              {columns.map((column) => (
                <th key={column.header} className="px-3 py-3 font-medium">
                  {column.header}
                </th>
              ))}
              {actions ? <th className="px-3 py-3 text-right font-medium">Action</th> : null}
            </tr>
          </thead>
          <tbody>
            {slice.map((row) => (
              <tr key={row.id} className="border-t border-white/8 text-white">
                {columns.map((column) => (
                  <td key={column.header} className="px-3 py-4 align-middle">
                    {column.cell(row)}
                  </td>
                ))}
                {actions ? (
                  <td className="px-3 py-4 text-right">
                    <RowMenu row={row} actions={actions(row)} onNavigate={(href) => router.push(href)} />
                  </td>
                ) : null}
              </tr>
            ))}
            {slice.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-10 text-[#B4B4B4]">
                  No matching records.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <Pager page={safePage} pages={pages} onPage={setPage} />
    </div>
  )
}

function RowMenu<T>({
  row,
  actions,
  onNavigate,
}: {
  row: T
  actions: RowAction<T>[]
  onNavigate: (href: string) => void
}) {
  const visible = actions.filter((action) => !action.hidden?.(row))
  if (visible.length === 0) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex size-8 items-center justify-center rounded-lg text-[#B4B4B4] hover:bg-white/5 hover:text-white"
        aria-label="Row actions"
      >
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40 rounded-xl bg-[#3a3a3a] p-1.5 text-white ring-white/10">
        {visible.map((action) => {
          const Icon = action.icon
          const color =
            action.tone === "danger" ? "text-red-400" : action.tone === "ok" ? "text-emerald-400" : "text-white"
          return (
            <DropdownMenuItem
              key={action.label}
              className={cn("justify-between rounded-lg px-3 py-2", color)}
              onClick={() => {
                if (action.href) onNavigate(action.href)
                action.onSelect?.(row)
              }}
            >
              {action.label}
              <Icon className="size-4" />
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
}) {
  return (
    <Field label={label}>
      <Input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </Field>
  )
}

export const viewAction = { label: "View", icon: Eye }
export const editAction = { label: "Edit", icon: Pencil }
export const deleteAction = { label: "Delete", icon: Trash2, tone: "danger" as const }

export function GradientButton({
  children,
  type = "button",
  onClick,
  className,
}: {
  children: React.ReactNode
  type?: "button" | "submit"
  onClick?: () => void
  className?: string
}) {
  return (
    <Button type={type} variant="gradient" size="xl" onClick={onClick} className={className}>
      {children}
    </Button>
  )
}
