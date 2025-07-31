"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, QrCode, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { WalletAccount } from "@/lib/types"
import { Connection } from "@solana/web3.js";
import useSolConnection from "@/hooks/useSolConnection"
interface SendModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  wallet: WalletAccount
  onSend: (connection: Connection, sender: string, recipient: string, amount: number) => Promise<{ success: boolean; message: string; txHash?: string }>
}

type SendStep = "form" | "confirm" | "sending" | "success" | "error"

export function SendModal({ open, onOpenChange, wallet, onSend }: SendModalProps) {
  const [currentStep, setCurrentStep] = useState<SendStep>("form")
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState<number>(0)
  const [amountUSD, setAmountUSD] = useState<number>(0)
  const [useUSD, setUseUSD] = useState(false)
  const [error, setError] = useState("")
  const [txHash, setTxHash] = useState("")
  const [resultMessage, setResultMessage] = useState("")

  // Mock exchange rate (in real app, this would come from an API)
  const exchangeRate = 25.5 // 1 SOL = $25.50

  useEffect(() => {
    if (useUSD && amount) {
      const usdValue = (amount * exchangeRate)
      setAmountUSD(usdValue)
    } else if (!useUSD && amount) {
      const tokenValue = (amount / exchangeRate)
      setAmountUSD(tokenValue)
    }
  }, [amount, useUSD, exchangeRate])

  const validateForm = () => {
    if (!recipient.trim()) {
      setError("Please enter a recipient address")
      return false
    }

    if (!amount || amount <= 0) {
      setError("Please enter a valid amount")
      return false
    }

    const amountNum = useUSD ? amount / exchangeRate : amount
    const availableBalance = wallet.balance

    if (amountNum > availableBalance) {
      setError("Insufficient balance")
      return false
    }

    // Basic address validation (in real app, this would be more sophisticated)
    if (recipient.length < 32) {
      setError("Invalid address format")
      return false
    }

    setError("")
    return true
  }

  const handleNext = () => {
    if (validateForm()) {
      setCurrentStep("confirm")
    }
  }

  const handleSend = async () => {
    try {
      const connection = useSolConnection();
      setCurrentStep("sending")
      const result = await onSend(connection, wallet.address, recipient, amount)

      if (result.success) {
        setTxHash(result.txHash || "")
        setResultMessage(result.message)
        setCurrentStep("success")
      } else {
        setResultMessage(result.message)
        setCurrentStep("error")
      }
    } catch (error) {
      setResultMessage("An unexpected error occurred")
      setCurrentStep("error")
    }
  }

  const handleClose = () => {
    setCurrentStep("form")
    setRecipient("")
    setAmount(0)
    setAmountUSD(0)
    setError("")
    setTxHash("")
    setResultMessage("")
    onOpenChange(false)
  }

  const handleBack = () => {
    if (currentStep === "confirm") {
      setCurrentStep("form")
    } else {
      handleClose()
    }
  }

  const setMaxAmount = () => {
    if (useUSD) {
      const maxUSD = wallet.balance * exchangeRate
      setAmount(maxUSD)
    } else {
      setAmount(wallet.balance)
    }
  }

  const toggleCurrency = () => {
    if (amount) {
      if (useUSD) {
        // Convert from USD to token
        const tokenAmount = amount / exchangeRate
        setAmount(tokenAmount)
      } else {
        // Convert from token to USD
        const usdAmount = amount * exchangeRate
        setAmount(usdAmount)
      }
    }
    setUseUSD(!useUSD)
  }

  const renderFormStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <img src={wallet.chain.icon} alt={wallet.chain.name} className="w-16 h-16" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient's {wallet.chain.name} address</Label>
          <div className="relative">
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={`Enter ${wallet.chain.name} address`}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleCurrency}
                className="h-6 px-2 text-xs bg-transparent"
              >
                {useUSD ? "USD" : wallet.chain.name.toUpperCase()}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={setMaxAmount}
                className="h-6 px-2 text-xs bg-transparent"
              >
                Max
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{useUSD ? "$" : "~$"}</div>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0.00"
              className="pl-8"
              step={useUSD ? "0.01" : "0.000001"}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{useUSD ? `~${amountUSD} ${wallet.chain.name.toUpperCase()}` : `~$${amountUSD}`}</span>
            <span>
              Available {wallet.balance} {wallet.chain.name.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex space-x-3">
        <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
          Cancel
        </Button>
        <Button onClick={handleNext} className="flex-1" disabled={!recipient || !amount}>
          Next
        </Button>
      </div>
    </div>
  )

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
       <img src={wallet.chain.icon} alt={wallet.chain.name} className="w-16 h-16" />
        <div>
          <h3 className="text-lg font-semibold">Confirm Transaction</h3>
          <p className="text-muted-foreground">Review the details before sending</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">To:</span>
            <span className="font-mono text-sm">
              {recipient.slice(0, 8)}...{recipient.slice(-8)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <div className="text-right">
              <div className="font-semibold">{useUSD ? `$${amount}` : `${amount} ${wallet.chain.name.toUpperCase()}`}</div>
              <div className="text-sm text-muted-foreground">
                {useUSD ? `~${amountUSD} ${wallet.chain.name.toUpperCase()}` : `~$${amountUSD}`}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Network Fee:</span>
            <span className="text-sm">~0.000005 {wallet.chain.name.toUpperCase()}</span>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Double-check the recipient address. Transactions cannot be reversed.</AlertDescription>
        </Alert>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleSend} className="flex-1">
          Send {wallet.chain.name.toUpperCase()}
        </Button>
      </div>
    </div>
  )

  const renderSendingStep = () => (
    <div className="space-y-6 text-center">
      <div className="flex items-center justify-center">
        <div className={`flex h-16 w-16 items-center justify-center rounded-full ${wallet.chain.color}`}>
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Sending Transaction</h3>
        <p className="text-muted-foreground">Please wait while we process your transaction...</p>
      </div>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-green-600">Transaction Successful!</h3>
        <p className="text-muted-foreground">{resultMessage}</p>
      </div>

      {txHash && (
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground mb-2">Transaction Hash:</div>
          <div className="font-mono text-xs break-all">{txHash}</div>
        </div>
      )}

      <div className="flex space-x-3">
        <Button variant="outline" className="flex-1 bg-transparent">
          View on Explorer
        </Button>
        <Button onClick={handleClose} className="flex-1">
          Done
        </Button>
      </div>
    </div>
  )

  const renderErrorStep = () => (
    <div className="space-y-6 text-center">
      <div className="flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500">
          <XCircle className="h-8 w-8 text-white" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-red-600">Transaction Failed</h3>
        <p className="text-muted-foreground">{resultMessage}</p>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setCurrentStep("form")} className="flex-1 bg-transparent">
          Try Again
        </Button>
        <Button onClick={handleClose} className="flex-1">
          Close
        </Button>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "form":
        return renderFormStep()
      case "confirm":
        return renderConfirmStep()
      case "sending":
        return renderSendingStep()
      case "success":
        return renderSuccessStep()
      case "error":
        return renderErrorStep()
      default:
        return renderFormStep()
    }
  }

  const getTitle = () => {
    switch (currentStep) {
      case "form":
        return `Send ${wallet.chain.name.toUpperCase()}`
      case "confirm":
        return "Confirm Transaction"
      case "sending":
        return "Sending..."
      case "success":
        return "Success"
      case "error":
        return "Error"
      default:
        return `Send ${wallet.chain.name.toUpperCase()}`
    }
  }

  return (
    <Dialog open={open} onOpenChange={currentStep === "sending" ? undefined : handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {(currentStep === "confirm" || currentStep === "form") && (
              <Button variant="ghost" size="sm" onClick={handleBack} className="h-6 w-6 p-0 mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <span>{getTitle()}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">{renderCurrentStep()}</div>
      </DialogContent>
    </Dialog>
  )
}
