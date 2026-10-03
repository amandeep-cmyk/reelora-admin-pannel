import type { Metadata } from "next"
import { ServiceProfile } from "@/components/screens/catalog-screens"

export const metadata: Metadata = { title: "Service" }

export default function Page() {
  return <ServiceProfile />
}
