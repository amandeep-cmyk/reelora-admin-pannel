import type { Metadata } from "next"
import { TalentsView } from "./talents-view"

export const metadata: Metadata = { title: "Talents" }

export default function Page() {
  return <TalentsView />
}
