"use client"

import { Wallet } from "lucide-react"

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
        <Wallet className="h-4 w-4 text-primary-foreground" />
      </div>
      <span className="font-semibold text-2xl">Walliy</span>
    </div>
  )
}
