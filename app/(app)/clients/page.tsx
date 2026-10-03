import type { Metadata } from "next"
import { ClientList } from "@/components/screens/people-screens"

export const metadata: Metadata = { title: "Clients" }

export default function Page() {
  return <ClientList />
}
