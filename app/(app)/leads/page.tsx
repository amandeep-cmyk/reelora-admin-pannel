import type { Metadata } from "next"
import { LeadList } from "@/components/screens/people-screens"

export const metadata: Metadata = { title: "Lead requests" }

export default function Page() {
  return <LeadList />
}
