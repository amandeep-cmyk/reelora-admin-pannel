import type { Metadata } from "next"
import { ProductDetailView } from "./product-detail-view"

export const metadata: Metadata = { title: "Product" }

export default function Page() {
  return <ProductDetailView />
}
