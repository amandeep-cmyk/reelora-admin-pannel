import type { Metadata } from "next"
import { BookingProfile } from "@/components/screens/booking-screens"

export const metadata: Metadata = { title: "Booking" }

export default function Page() {
  return <BookingProfile />
}
