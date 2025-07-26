"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Copy, Check, Download, ExternalLink } from "lucide-react"
import QRCode from "qrcode"
import { useEffect } from "react"

interface ReceiveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  walletAddress: string
  networkName: string
  networkIcon: string
}

export function ReceiveModal({ open, onOpenChange, walletAddress, networkName, networkIcon }: ReceiveModalProps) {
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  useEffect(() => {
    if (walletAddress && open) {
      generateQRCode()
    }
  }, [walletAddress, open])

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(walletAddress, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
      setQrCodeUrl(url)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
  }

  const copyAddress = async () => {
    await navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a")
      link.download = `${networkName}-wallet-qr.png`
      link.href = qrCodeUrl
      link.click()
    }
  }

  const handleClose = () => {
    setCopied(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Receive Address</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* QR Code Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {qrCodeUrl ? (
                <div className="relative p-4 bg-white rounded-lg border">
                  <img src={qrCodeUrl || "/placeholder.svg"} alt="Wallet QR Code" className="w-48 h-48" />
                  {/* Network Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      {/* <div className="text-2xl">{networkIcon}</div> */}
                      <img src={networkIcon} alt={networkName} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-muted-foreground">Generating QR Code...</div>
                </div>
              )}
            </div>

            <div className="text-center">
              <h3 className="font-medium text-lg mb-2">Your {networkName} Address</h3>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-mono text-sm break-all text-center">{walletAddress}</p>
            </div>

            <Button onClick={copyAddress} variant="outline" className="w-full bg-transparent">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          {/* Additional Actions */}
          <div className="flex space-x-2">
            <Button onClick={downloadQRCode} variant="outline" className="flex-1 bg-transparent" disabled={!qrCodeUrl}>
              <Download className="mr-2 h-4 w-4" />
              Save QR
            </Button>
            <Button
              onClick={() => window.open(`https://explorer.solana.com/address/${walletAddress}`, "_blank")}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Explorer
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              This address can only be used to receive compatible tokens.{" "}
              <button className="text-primary hover:underline">Learn more</button>
            </p>
          </div>

          {/* Close Button */}
          <Button onClick={handleClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
