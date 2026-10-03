import type { Metadata } from "next"
import { TalentList } from "@/components/screens/people-screens"

export const metadata: Metadata = { title: "Talents" }

export default function Page() {
  return <TalentList />
}
