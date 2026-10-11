import type { Metadata } from "next"
import { Suspense } from "react"
import { SearchView } from "./search-view"

export const metadata: Metadata = { title: "Search" }

export default function Page() {
  return (
    <Suspense fallback={<p className="text-sm text-[#B4B4B4]">Loading search…</p>}>
      <SearchView />
    </Suspense>
  )
}
