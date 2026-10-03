"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "border border-white/10 bg-[#2a2a2a] text-white",
          description: "text-[#B4B4B4]",
        },
      }}
      {...props}
    />
  )
}
