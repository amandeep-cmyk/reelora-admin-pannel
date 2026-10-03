import type { Metadata } from "next"
import { BookingList } from "@/components/screens/booking-screens"

export const metadata: Metadata = { title: "Bookings" }

export default function Page() {
  return <BookingList />
}
