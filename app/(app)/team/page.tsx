import type { Metadata } from "next"
import { TeamList } from "@/components/screens/ops-screens"

export const metadata: Metadata = { title: "Team" }

export default function Page() {
  return <TeamList />
}
