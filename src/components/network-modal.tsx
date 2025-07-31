"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Network as NetworkIcon, AlertTriangle, Check } from "lucide-react"
import { useDispatch } from "react-redux"
import { setNetwork } from "@/features/networkSlice"
import { Network } from "@/lib/types"
import { useSelector } from "react-redux"
import { RootState } from "@/app/store"
interface NetworkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface NetworkOption {
  id: Network
  name: string
  description: string
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive"
}

const NETWORK_OPTIONS: NetworkOption[] = [
  {
    id: Network.MAINNET,
    name: "Mainnet",
    description: "Production chain with real assets and transactions",
    badge: "Live",
    badgeVariant: "default",
  },
  {
    id: Network.DEVNET,
    name: "Devnet",
    description: "Development chain for testing with free tokens",
    badge: "Development",
    badgeVariant: "secondary",
  },
  {
    id: Network.TESTNET,
    name: "Testnet",
    description: "Test chain for final testing before mainnet deployment",
    badge: "Testing",
    badgeVariant: "secondary",
  },
]

export function NetworkModal({ open, onOpenChange }: NetworkModalProps) {
  const dispatch = useDispatch();
  const currentNetwork = useSelector((state: RootState) => state.networks.selectedNetwork)
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(currentNetwork)

  const handleSave = () => {
    dispatch(setNetwork(selectedNetwork))
    onOpenChange(false)
  }

  const handleClose = () => {
    dispatch(setNetwork(currentNetwork)) 
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <NetworkIcon className="h-5 w-5 text-primary" />
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

          <RadioGroup value={selectedNetwork} onValueChange={(value) => setSelectedNetwork(value as Network)}>
            <div className="space-y-3">
              {NETWORK_OPTIONS.map((network) => (
                <div key={network.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent">
                  <RadioGroupItem value={network.id} id={network.id} className="cursor-pointer" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Label htmlFor={network.id} className="font-medium cursor-pointer">
                        {network.name}
                      </Label>
                      {network.badge && (
                        <Badge variant={network.badgeVariant} className="text-xs">
                          {network.badge}
                        </Badge>
                      )}
                      {network.id === currentNetwork && (
                        <div className="flex items-center space-x-1">
                          <Check className="h-3 w-3 text-primary" />
                          <span className="text-xs text-primary font-medium">Current</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{network.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>

          {selectedNetwork !== Network.MAINNET && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> {selectedNetwork === Network.DEVNET ? "Devnet" : "Testnet"} tokens have no real
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
