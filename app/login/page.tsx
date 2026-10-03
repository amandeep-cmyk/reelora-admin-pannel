import type { Metadata } from "next"
import Image from "next/image"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Log in" }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#212121] p-3 md:p-4">
      <div className="grid min-h-[calc(100vh-1.5rem)] items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
        <div className="relative h-72 overflow-hidden rounded-[28px] lg:h-[calc(100vh-2rem)]">
          <Image
            src="/media/auth.jpg"
            alt="Crew rehearsing on a lit stage"
            fill
            priority
            className="object-cover"
            sizes="60vw"
          />
        </div>
        <div className="flex items-center justify-center px-3 py-8 sm:px-8">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
