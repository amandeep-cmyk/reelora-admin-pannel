import type { Metadata } from "next"
import Link from "next/link"
import { SheetCard } from "@/components/crm/ui"

export const metadata: Metadata = { title: "Plan" }

export default function Page() {
  return (
    <SheetCard>
      <p className="text-sm text-[#B4B4B4]">Membership plans are not in the backend.</p>
      <Link href="/membership" className="mt-3 inline-block text-sm text-[#E1306C]">
        Back to membership
      </Link>
    </SheetCard>
  )
}
