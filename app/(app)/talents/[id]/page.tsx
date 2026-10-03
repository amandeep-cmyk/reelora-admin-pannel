import type { Metadata } from "next"
import { TalentProfile } from "@/components/screens/people-screens"

export const metadata: Metadata = { title: "Talent" }

export default function Page() {
  return <TalentProfile />
}
