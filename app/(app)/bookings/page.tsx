import type { Metadata } from "next"
import { BookingsView } from "./bookings-view"

export const metadata: Metadata = { title: "Bookings" }

export default function Page() {
  return <BookingsView />
}
