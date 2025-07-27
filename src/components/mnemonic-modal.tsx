"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Check, Eye, EyeOff, Shield, AlertTriangle } from "lucide-react"
import { Key } from "lucide-react"

interface MnemonicModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MnemonicModal({ open, onOpenChange }: MnemonicModalProps) {
  const [mnemonic, setMnemonic] = useState<string[]>([])
  useEffect(() => {
    setMnemonic(localStorage.getItem("mnemonic")?.split(" ") || [])
  }, [])
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const storedPassword = localStorage.getItem("password")
    if (password === storedPassword) {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Incorrect password. Please try again.")
    }
  }

  const copyMnemonic = async () => {
    await navigator.clipboard.writeText(mnemonic.join(" "))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    setPassword("")
    setIsAuthenticated(false)
    setError("")
    setCopied(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-primary" />
            <span>Recovery Phrase</span>
          </DialogTitle>
          <DialogDescription>
            {!isAuthenticated ? "Enter your password to view your recovery phrase" : "Your 12-word recovery phrase"}
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your wallet password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={!password}>
                Verify
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Never share your recovery phrase with anyone. Anyone with this phrase can access your wallet.
              </AlertDescription>
            </Alert>

            <div className="p-4 rounded-lg bg-muted border">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {mnemonic.map((word, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-background rounded">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="text-sm font-mono">{word}</span>
                  </div>
                ))}
              </div>

              <Button variant="outline" onClick={copyMnemonic} className="w-full bg-transparent">
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </div>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
