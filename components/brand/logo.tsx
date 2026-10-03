import Image from "next/image"
import { cn } from "cn"

/** Wordmark used in the navbar and footer. */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo/logo_with_name.png"
      alt="Reelora"
      width={182}
      height={36}
      priority
      className={cn("h-8 w-auto", className)}
    />
  )
}
