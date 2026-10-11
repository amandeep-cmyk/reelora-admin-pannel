import type { Metadata } from "next"
import { ApprovalsView } from "./approvals-view"

export const metadata: Metadata = { title: "Product approval" }

export default function Page() {
  return <ApprovalsView />
}
