import type { Metadata } from "next"
import { VendorDetailView } from "./vendor-detail-view"

export const metadata: Metadata = { title: "Vendor" }

export default function Page() {
  return <VendorDetailView />
}
