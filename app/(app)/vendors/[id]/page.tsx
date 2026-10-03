import type { Metadata } from "next"
import { VendorProfile } from "@/components/screens/people-screens"

export const metadata: Metadata = { title: "Vendor" }

export default function Page() {
  return <VendorProfile />
}
