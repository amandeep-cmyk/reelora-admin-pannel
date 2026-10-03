import type { Metadata } from "next"
import { ServiceList } from "@/components/screens/catalog-screens"

export const metadata: Metadata = { title: "Services" }

export default function Page() {
  return <ServiceList />
}
