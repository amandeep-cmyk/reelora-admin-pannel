import type { Metadata } from "next"
import { BookingDetailView } from "./booking-detail-view"

export const metadata: Metadata = { title: "Booking" }

export default function Page() {
  return <BookingDetailView />
}
