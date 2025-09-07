"use client"

import { Button } from "@medusajs/ui"
import React from "react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  variant = "primary",
  className,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | null
  className?: string
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      size="large"
      className={`
        bg-gradient-to-r from-cyan-500 to-cyan-600 
        hover:from-cyan-600 hover:to-cyan-700
        text-white font-semibold 
        px-8 py-4 rounded-xl 
        shadow-lg shadow-cyan-500/25 
        hover:shadow-xl hover:shadow-cyan-500/35
        disabled:from-gray-600 disabled:to-gray-700 
        disabled:shadow-gray-500/25
        transition-all duration-200 
        transform hover:scale-[1.02] 
        disabled:hover:scale-100
        border-0 
        ${className}
      `}
      type="submit"
      isLoading={pending}
      variant="transparent"
      data-testid={dataTestId}
    >
      {children}
    </Button>
  )
}
