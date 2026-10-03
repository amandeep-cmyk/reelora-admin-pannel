import type { Metadata } from "next"
import { ProductList } from "@/components/screens/catalog-screens"

export const metadata: Metadata = { title: "Products" }

export default function Page() {
  return <ProductList />
}
