import type { Metadata } from "next"
import { BannerList } from "@/components/screens/ops-screens"

export const metadata: Metadata = { title: "Banners" }

export default function Page() {
  return <BannerList />
}
