"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, X, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "cn"

// Page title box used by most admin screens.
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

// Rounded panel for detail pages.
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

// Small number card on dashboards and list headers.
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

// Colors status words green or red when useful.
export function StatusText({ value }: { value: string }) {
  const key = value.toLowerCase()
  const good = ["active", "approved", "booked", "completed", "confirmed", "confirmed_by_admin", "paid_upfront", "in_progress", "settled", "published"]
  const bad = ["inactive", "rejected", "cancelled", "refunded"]
  const tone = good.includes(key) ? "text-emerald-400" : bad.includes(key) ? "text-red-400" : "text-white"
  return <span className={cn("capitalize", tone)}>{value.replaceAll("_", " ")}</span>
}

// Back arrow plus page title.
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
  return <span className="rounded-full bg-[#333333] px-3 py-1 text-xs text-[#d0d0d0]">{children}</span>
}

// Label / value rows on profile pages.
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

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <Label className="font-normal text-[#B4B4B4]">{label}</Label>
      {children}
    </label>
  )
}

// Simple popup that closes on Escape or outside click.
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

// Shown when a detail page cannot find the record.
export function Missing({ href, label }: { href: string; label: string }) {
  return (
    <SheetCard>
      <p className="text-[#B4B4B4]">This record is not in the directory.</p>
      <Link href={href} className="mt-3 inline-block text-sm text-[#E1306C]">
        Back to {label}
      </Link>
    </SheetCard>
  )
}
