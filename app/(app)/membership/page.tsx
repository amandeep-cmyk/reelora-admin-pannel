import type { Metadata } from "next"
import { MembershipList } from "@/components/screens/ops-screens"

export const metadata: Metadata = { title: "Membership" }

export default function Page() {
  return <MembershipList />
}
