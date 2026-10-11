"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  ChevronDown,
  Clapperboard,
  Gem,
  ImageIcon,
  Inbox,
  LayoutGrid,
  LogOut,
  Package,
  Search,
  Shield,
  Store,
  Tags,
  UserRound,
  Users,
  CalendarDays,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { GradientText } from "@/components/brand/gradient-text"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/providers/auth-provider"
import { loadBookings, loadServices } from "@/lib/load-admin"
import { cn } from "cn"

type Item = { href: string; label: string; icon: LucideIcon }

const items: Item[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/clients", label: "Clients", icon: UserRound },
  { href: "/talents", label: "Talent Management", icon: Shield },
  { href: "/vendors", label: "Vendor Management", icon: Store },
  { href: "/services", label: "Services", icon: Clapperboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/approvals", label: "Product Approval", icon: BadgeCheck },
  { href: "/leads", label: "Lead Requests", icon: Inbox },
  { href: "/banners", label: "Banner Management", icon: ImageIcon },
  { href: "/team", label: "Team", icon: Users },
  { href: "/membership", label: "Membership", icon: Gem },
]

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}

// Layout around every admin page: top bar, sidebar, logout, login check.
export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, ready, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Send visitors without a session to the login page.
  useEffect(() => {
    if (ready && !user) router.replace("/login")
  }, [ready, user, router])

  if (!ready || !user) {
    return <p className="px-6 py-20 text-sm text-[#B4B4B4]">Loading your workspace…</p>
  }

  function signOut() {
    logout()
    router.replace("/login")
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="reelora-nav" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F77737" />
            <stop offset="50%" stopColor="#E1306C" />
            <stop offset="100%" stopColor="#405DE6" />
          </linearGradient>
        </defs>
      </svg>

      <header className="flex items-center gap-4 px-4 py-4 md:px-6">
        <Link href="/dashboard" className="shrink-0">
          <Logo />
        </Link>
        <GlobalSearch />
        <div className="ml-auto flex items-center gap-2">
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full py-1 pr-1 pl-1 hover:bg-white/5">
              <Avatar className="size-9">
                <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <ChevronDown className="size-4 text-[#B4B4B4]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44 rounded-xl bg-[#3a3a3a] text-white">
              <DropdownMenuItem className="px-3 py-2" onClick={() => router.push("/team")}>
                Admin team
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-2 text-[#E1306C]" onClick={signOut}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex items-start">
        <aside className="sticky top-0 hidden h-[calc(100vh-4.5rem)] w-56 shrink-0 flex-col px-3 pb-6 md:flex">
          <nav className="flex flex-col gap-0.5 overflow-y-auto">
            {items.map((item) => (
              <NavLink key={item.href} item={item} active={isActive(item.href, pathname)} />
            ))}
          </nav>
          <button type="button" onClick={signOut} className="mt-4 flex items-center gap-3 px-2 py-2.5 text-sm text-[#E1306C]">
            <LogOut className="size-4" />
            Logout
          </button>
        </aside>

        <div className="min-w-0 flex-1 px-3 pb-10 md:pr-5 md:pl-2">
          <nav className="mb-3 flex gap-2 overflow-x-auto md:hidden">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-full bg-[#2a2a2a] px-3 py-2 text-xs",
                  isActive(item.href, pathname) ? "text-white" : "text-[#B4B4B4]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

function NavLink({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon
  return (
    <Link href={item.href} className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm">
      <Icon
        className={cn("size-4 shrink-0", active ? "text-[#E1306C]" : "text-[#B4B4B4]")}
        stroke={active ? "url(#reelora-nav)" : "currentColor"}
      />
      {active ? (
        <GradientText className="font-medium">{item.label}</GradientText>
      ) : (
        <span className="text-[#cfcfcf]">{item.label}</span>
      )}
    </Link>
  )
}

// Top search box: typing then Enter opens the search page.
function GlobalSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  return (
    <form
      className="relative mx-auto hidden w-full max-w-md md:block"
      onSubmit={(event) => {
        event.preventDefault()
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      }}
    >
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#B4B4B4]" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Global Search"
        className="h-11 w-full rounded-full border border-white/10 bg-[#2a2a2a] pr-4 pl-11 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#E1306C]"
      />
    </form>
  )
}

// Bell menu with draft listing and unassigned booking counts.
function NotificationBell() {
  const [drafts, setDrafts] = useState(0)
  const [unassigned, setUnassigned] = useState(0)

  useEffect(() => {
    let live = true
    Promise.all([loadServices(), loadBookings()])
      .then(([services, bookings]) => {
        if (!live) return
        setDrafts(services.filter((item) => item.listingStatus !== "published").length)
        setUnassigned(
          bookings.filter(
            (item) =>
              !item.teamMemberId &&
              item.status !== "cancelled" &&
              item.status !== "refunded" &&
              item.status !== "pending_payment",
          ).length,
        )
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [])

  const notes = [
    drafts ? `${drafts} listings are still drafts` : "No draft listings",
    unassigned ? `${unassigned} bookings have no team member` : "Every live booking has a team member",
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 rounded-xl bg-[#3a3a3a] p-1 text-white">
        {notes.map((note) => (
          <DropdownMenuItem key={note} className="px-3 py-2 text-sm whitespace-normal">
            {note}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
