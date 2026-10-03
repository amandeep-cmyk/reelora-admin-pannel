import type { Metadata } from "next"
import { ApprovalList } from "@/components/screens/catalog-screens"

export const metadata: Metadata = { title: "Product approval" }

export default function Page() {
  return <ApprovalList />
}
