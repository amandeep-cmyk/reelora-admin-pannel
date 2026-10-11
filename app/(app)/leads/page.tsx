import type { Metadata } from "next"
import { Page } from "@/components/crm/ui"

export const metadata: Metadata = { title: "Lead requests" }

export default function PageRoute() {
  return (
    <Page title="Lead Requests">
      <p className="max-w-2xl text-sm leading-6 text-[#B4B4B4]">
        The backend has no lead inbox. People who finish registration show up under Clients, Talents, or Vendors.
      </p>
    </Page>
  )
}
