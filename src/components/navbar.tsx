"use client"

import { useState } from "react"
import { ThemeToggler } from "./theme-toggler"
import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis, Key, Network } from "lucide-react"
import { MnemonicModal } from "./mnemonic-modal"
import { NetworkModal } from "./network-modal"

export function Navbar() {
  const [showMnemonicModal, setShowMnemonicModal] = useState(false)
  const [showNetworkModal, setShowNetworkModal] = useState(false)

  return (
    <>
      <div className="flex flex-row justify-between items-center p-4 relative">
        <Logo />
        <div className="flex gap-2 justify-between items-center">
          <ThemeToggler />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setShowMnemonicModal(true)} className="cursor-pointer">
                <Key className="mr-2 h-4 w-4" />
                Show Mnemonic
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowNetworkModal(true)} className="cursor-pointer">
                <Network className="mr-2 h-4 w-4" />
                Change Network
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <MnemonicModal open={showMnemonicModal} onOpenChange={setShowMnemonicModal} />
      <NetworkModal open={showNetworkModal} onOpenChange={setShowNetworkModal} />
    </>
  )
}
