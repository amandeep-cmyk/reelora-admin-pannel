import type { Metadata } from "next"
import { CategoryList } from "@/components/screens/catalog-screens"

export const metadata: Metadata = { title: "Categories" }

export default function Page() {
  return <CategoryList />
}
