import type { Metadata } from "next"
import { VendorList } from "@/components/screens/people-screens"

export const metadata: Metadata = { title: "Vendors" }

export default function Page() {
  return <VendorList />
}
