"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Network, AlertTriangle, Check } from "lucide-react"

interface NetworkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type NetworkType = "mainnet" | "devnet" | "testnet"

interface NetworkOption {
  id: NetworkType
  name: string
  description: string
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive"
}

const NETWORK_OPTIONS: NetworkOption[] = [
  {
    id: "mainnet",
    name: "Mainnet",
    description: "Production chain with real assets and transactions",
    badge: "Live",
    badgeVariant: "default",
  },
  {
    id: "devnet",
    name: "Devnet",
    description: "Development chain for testing with free tokens",
    badge: "Development",
    badgeVariant: "secondary",
  },
  {
    id: "testnet",
    name: "Testnet",
    description: "Test chain for final testing before mainnet deployment",
    badge: "Testing",
    badgeVariant: "secondary",
  },
]

export function NetworkModal({ open, onOpenChange }: NetworkModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>("mainnet")
  const [currentNetwork] = useState<NetworkType>("mainnet")

  const handleSave = () => {
    console.log("Switching to chain:", selectedNetwork)
    onOpenChange(false)
  }

  const handleClose = () => {
    setSelectedNetwork(currentNetwork) 
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-primary" />
            <span>Change Network</span>
          </DialogTitle>
          <DialogDescription>Select the chain you want to connect to</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Developer Setting:</strong> This feature is intended for developers and advanced users. Changing
              networks will affect all wallet operations.
            </AlertDescription>
          </Alert>

          <RadioGroup value={selectedNetwork} onValueChange={(value) => setSelectedNetwork(value as NetworkType)}>
            <div className="space-y-3">
              {NETWORK_OPTIONS.map((chain) => (
                <div key={chain.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent">
                  <RadioGroupItem value={chain.id} id={chain.id} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Label htmlFor={chain.id} className="font-medium cursor-pointer">
                        {chain.name}
                      </Label>
                      {chain.badge && (
                        <Badge variant={chain.badgeVariant} className="text-xs">
                          {chain.badge}
                        </Badge>
                      )}
                      {chain.id === currentNetwork && (
                        <div className="flex items-center space-x-1">
                          <Check className="h-3 w-3 text-primary" />
                          <span className="text-xs text-primary font-medium">Current</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{chain.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>

          {selectedNetwork !== "mainnet" && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> {selectedNetwork === "devnet" ? "Devnet" : "Testnet"} tokens have no real
                value. Only use this chain for development and testing purposes.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1" disabled={selectedNetwork === currentNetwork}>
              {selectedNetwork === currentNetwork ? "Current Network" : "Switch Network"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
