"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { BackTitle, SheetCard } from "@/components/crm/ui"

export function ProductDetailView() {
  const params = useParams<{ id: string }>()
  return (
    <SheetCard>
      <BackTitle href="/products" title="Listing" />
      <p className="text-sm text-[#B4B4B4]">Open this listing on the service page.</p>
      <Link href={`/services/${params.id}`} className="mt-3 inline-block text-sm text-[#E1306C]">
        Service overview
      </Link>
    </SheetCard>
  )
}
