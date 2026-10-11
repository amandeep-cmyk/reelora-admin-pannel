"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { GradientButton, Page } from "@/components/crm/ui"
import { getErrorMessage } from "@/lib/api/axiosInterceptor"
import type { Banner, FeaturedTalent, MarketingEvent } from "@/lib/schemas/marketing.schema"
import {
  createBanner,
  createEvent,
  createFeaturedTalent,
  deleteBanner,
  deleteEvent,
  deleteFeaturedTalent,
  listBanners,
  listEvents,
  listFeaturedTalents,
  updateBanner,
  updateEvent,
  updateFeaturedTalent,
} from "@/lib/services/marketing"

const field = "h-11 w-full rounded-xl border border-white/10 bg-[#2c2c2c] px-3 text-sm text-white outline-none"

export function BannersView() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [events, setEvents] = useState<MarketingEvent[]>([])
  const [talents, setTalents] = useState<FeaturedTalent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Load banners, events, and featured talents together.
  function load() {
    setLoading(true)
    setError("")
    Promise.all([listBanners(), listEvents(), listFeaturedTalents()])
      .then(([nextBanners, nextEvents, nextTalents]) => {
        setBanners(nextBanners)
        setEvents(nextEvents)
        setTalents(nextTalents)
      })
      .catch(() => setError("Could not load marketing content."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // Load data when the page opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- starting a fetch needs loading flags
    load()
  }, [])

  return (
    <Page title="Banner Management">
      {loading ? <p className="mb-4 text-sm text-[#B4B4B4]">Loading…</p> : null}
      {error ? (
        <p className="mb-4 text-sm text-[#E1306C]">
          {error}{" "}
          <button type="button" className="underline" onClick={load}>
            Retry
          </button>
        </p>
      ) : null}
      <div className="space-y-8">
        <BannerForm items={banners} onChange={load} />
        <EventForm items={events} onChange={load} />
        <TalentForm items={talents} onChange={load} />
      </div>
    </Page>
  )
}

function BannerForm({ items, onChange }: { items: Banner[]; onChange: () => void }) {
  const [audience, setAudience] = useState("both")
  const [placement, setPlacement] = useState("home")
  const [sortOrder, setSortOrder] = useState("0")
  const [photo, setPhoto] = useState<File | null>(null)
  const [pending, setPending] = useState(false)

  async function create() {
    if (!photo) {
      toast.error("Choose a photo.")
      return
    }
    const body = new FormData()
    body.set("photo", photo)
    body.set("audience", audience)
    body.set("placement", placement)
    body.set("sortOrder", sortOrder || "0")
    body.set("isActive", "true")
    setPending(true)
    try {
      const result = await createBanner(body)
      toast.success(result.message)
      setPhoto(null)
      onChange()
    } catch (caught) {
      toast.error(getErrorMessage(caught))
    } finally {
      setPending(false)
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-white">Home and ad banners</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <select className={field} value={audience} onChange={(event) => setAudience(event.target.value)}>
          <option value="web">Web</option>
          <option value="mobile">Mobile</option>
          <option value="both">Both</option>
        </select>
        <select className={field} value={placement} onChange={(event) => setPlacement(event.target.value)}>
          <option value="home">Home</option>
          <option value="ads">Ads</option>
        </select>
        <input className={field} value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} placeholder="Sort order" />
        <input
          className={field}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
        />
      </div>
      <GradientButton className="mt-4" onClick={() => void create()}>
        {pending ? "Uploading…" : "Upload banner"}
      </GradientButton>
      <Rows
        rows={items.map((item) => ({
          id: item._id,
          imageUrl: item.imageUrl,
          title: `${item.placement} · ${item.audience}`,
          active: item.isActive,
        }))}
        onToggle={(id, isActive) => updateBanner(id, flag(isActive)).then(onChange)}
        onDelete={(id) => deleteBanner(id).then(onChange)}
      />
    </section>
  )
}

function EventForm({ items, onChange }: { items: MarketingEvent[]; onChange: () => void }) {
  const [link, setLink] = useState("")
  const [details, setDetails] = useState("")
  const [startAt, setStartAt] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [pending, setPending] = useState(false)

  async function create() {
    if (!photo) {
      toast.error("Choose a photo.")
      return
    }
    const body = new FormData()
    body.set("photo", photo)
    body.set("link", link)
    body.set("details", details)
    body.set("startAt", new Date(startAt).toISOString())
    body.set("expiresAt", new Date(expiresAt).toISOString())
    body.set("isActive", "true")
    setPending(true)
    try {
      const result = await createEvent(body)
      toast.success(result.message)
      onChange()
    } catch (caught) {
      toast.error(getErrorMessage(caught))
    } finally {
      setPending(false)
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-white">Event banners</h2>
      <div className="mt-3 grid gap-3">
        <input className={field} value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://bookmyshow.com/event" />
        <textarea className={`${field} h-24 py-2`} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Details" />
        <div className="grid gap-3 md:grid-cols-2">
          <input className={field} type="datetime-local" value={startAt} onChange={(event) => setStartAt(event.target.value)} />
          <input className={field} type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} />
        </div>
        <input
          className={field}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
        />
      </div>
      <GradientButton className="mt-4" onClick={() => void create()}>
        {pending ? "Uploading…" : "Upload event"}
      </GradientButton>
      <Rows
        rows={items.map((item) => ({ id: item._id, imageUrl: item.imageUrl, title: item.details, active: item.isActive }))}
        onToggle={(id, isActive) => updateEvent(id, flag(isActive)).then(onChange)}
        onDelete={(id) => deleteEvent(id).then(onChange)}
      />
    </section>
  )
}

function TalentForm({ items, onChange }: { items: FeaturedTalent[]; onChange: () => void }) {
  const [name, setName] = useState("")
  const [instagramHandle, setInstagramHandle] = useState("")
  const [sortOrder, setSortOrder] = useState("0")
  const [photo, setPhoto] = useState<File | null>(null)
  const [pending, setPending] = useState(false)

  async function create() {
    if (!photo) {
      toast.error("Choose a photo.")
      return
    }
    const body = new FormData()
    body.set("photo", photo)
    body.set("name", name)
    body.set("instagramHandle", instagramHandle)
    body.set("sortOrder", sortOrder || "0")
    body.set("isActive", "true")
    setPending(true)
    try {
      const result = await createFeaturedTalent(body)
      toast.success(result.message)
      setName("")
      setInstagramHandle("")
      onChange()
    } catch (caught) {
      toast.error(getErrorMessage(caught))
    } finally {
      setPending(false)
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-white">Top influencers</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <input className={field} value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
        <input
          className={field}
          value={instagramHandle}
          onChange={(event) => setInstagramHandle(event.target.value)}
          placeholder="instagram handle"
        />
        <input className={field} value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} placeholder="Sort order" />
        <input
          className={field}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
        />
      </div>
      <GradientButton className="mt-4" onClick={() => void create()}>
        {pending ? "Uploading…" : "Upload influencer"}
      </GradientButton>
      <Rows
        rows={items.map((item) => ({
          id: item._id,
          imageUrl: item.imageUrl,
          title: `${item.name} · @${item.instagramHandle}`,
          active: item.isActive,
        }))}
        onToggle={(id, isActive) => updateFeaturedTalent(id, flag(isActive)).then(onChange)}
        onDelete={(id) => deleteFeaturedTalent(id).then(onChange)}
      />
    </section>
  )
}

function flag(isActive: boolean) {
  const body = new FormData()
  body.set("isActive", String(isActive))
  return body
}

function Rows({
  rows,
  onToggle,
  onDelete,
}: {
  rows: { id: string; imageUrl: string; title: string; active: boolean }[]
  onToggle: (id: string, isActive: boolean) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
}) {
  if (rows.length === 0) return <p className="mt-3 text-sm text-[#B4B4B4]">Nothing uploaded yet.</p>
  return (
    <div className="mt-4 space-y-2">
      {rows.map((row) => (
        <div key={row.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#2a2a2a] p-3">
          {row.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={row.imageUrl} alt="" className="h-14 w-24 rounded-lg object-cover" />
          ) : null}
          <p className="min-w-0 flex-1 truncate text-sm text-white">{row.title}</p>
          <button
            type="button"
            className="text-sm text-white"
            onClick={() => void onToggle(row.id, !row.active).catch((caught) => toast.error(getErrorMessage(caught)))}
          >
            {row.active ? "Hide" : "Show"}
          </button>
          <button
            type="button"
            className="text-sm text-[#E1306C]"
            onClick={() => void onDelete(row.id).catch((caught) => toast.error(getErrorMessage(caught)))}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
