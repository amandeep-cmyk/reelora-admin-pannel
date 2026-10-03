import type { Metadata } from "next"
import { ProductProfile } from "@/components/screens/catalog-screens"

export const metadata: Metadata = { title: "Product" }

export default function Page() {
  return <ProductProfile />
}
