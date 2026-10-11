import type { Metadata } from "next"
import { ServiceDetailView } from "./service-detail-view"

export const metadata: Metadata = { title: "Service" }

export default function Page() {
  return <ServiceDetailView />
}
