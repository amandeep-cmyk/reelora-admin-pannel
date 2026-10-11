import type { Metadata } from "next"
import { Page } from "@/components/crm/ui"

export const metadata: Metadata = { title: "Membership" }

export default function PageRoute() {
  return (
    <Page title="Membership">
      <p className="max-w-2xl text-sm leading-6 text-[#B4B4B4]">
        The backend has no membership plans. Provider payouts are tracked on the dashboard from finished bookings.
      </p>
    </Page>
  )
}
