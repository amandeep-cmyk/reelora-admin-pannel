import type { Metadata } from "next"
import { PlanProfile } from "@/components/screens/ops-screens"

export const metadata: Metadata = { title: "Plan" }

export default function Page() {
  return <PlanProfile />
}
