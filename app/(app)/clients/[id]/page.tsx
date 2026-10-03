import type { Metadata } from "next"
import { ClientProfile } from "@/components/screens/people-screens"

export const metadata: Metadata = { title: "Client" }

export default function Page() {
  return <ClientProfile />
}
