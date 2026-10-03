import { Suspense } from "react"
import { SearchScreen } from "@/components/screens/ops-screens"

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-[#B4B4B4]">Searching…</p>}>
      <SearchScreen />
    </Suspense>
  )
}
