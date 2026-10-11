import type { Metadata } from "next"
import { TalentDetailView } from "./talent-detail-view"

export const metadata: Metadata = { title: "Talent" }

export default function Page() {
  return <TalentDetailView />
}
