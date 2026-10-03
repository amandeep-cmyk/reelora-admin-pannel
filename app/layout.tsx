import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Reelora Admin",
    template: "%s · Reelora Admin",
  },
  description: "Admin dashboard for Reelora bookings, talent, vendors and revenue.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.className} dark h-full antialiased`}>
      <body className="min-h-full bg-[#1a1a1a] text-foreground">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
