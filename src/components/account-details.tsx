"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Download, Copy, Check, ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react"
import { CHAINS } from "@/lib/data"
import { WalletAccount } from "@/lib/types"
import { ReceiveModal } from "./receive-modal"
interface Transaction {
  id: string
  type: "send" | "receive"
  amount: string
  amountUSD: string
  address: string
  timestamp: string
  status: "completed" | "pending" | "failed"
  hash: string
}



const DUMMY_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "receive",
    amount: "0.5",
    amountUSD: "$125.50",
    address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    timestamp: "2 hours ago",
    status: "completed",
    hash: "5j7HnpjCJGGsybVQn6DAK8JjNRJznKzqXeHsLHSsXMpFRnYwn8",
  },
  {
    id: "2",
    type: "send",
    amount: "1.2",
    amountUSD: "$301.20",
    address: "DjVE6JNiYqPL2QXyCUUh8rNjHrbz6hXHNwkTtcxjRjE2",
    timestamp: "1 day ago",
    status: "completed",
    hash: "3k8JpqDKHHtzcwWr7EBL9KkOSKoaYzrZfItzMItTYNqGSoZxp9",
  },
  {
    id: "3",
    type: "receive",
    amount: "2.1",
    amountUSD: "$526.50",
    address: "8FE4vsubeRE4EXNuuQ4LazSHVtMxqSe9nFuDaZLY2Rm6",
    timestamp: "3 days ago",
    status: "completed",
    hash: "7m9LrqFMJJvzeyXs8GCM0MmPTMpbZzsagKvzNKvUZPsHTqAyr0",
  },
]

interface AccountDetailProps {
  wallet: WalletAccount
  onBack: () => void
}

export function AccountDetail({ wallet, onBack }: AccountDetailProps) {
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`
  }

  const copyToClipboard = async (text: string, item: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedItem(item)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  return (
    <>
    <div className="w-full max-w-md mx-auto space-y-6 min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button size="sm" variant="ghost" onClick={onBack} className="h-8 w-8 p-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${wallet.chain.color} text-white text-sm font-bold`}
          >
            {wallet.chain.icon}
          </div>
          <div>
            <h1 className="font-semibold text-lg">{wallet.name}</h1>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span className="font-mono">{truncateAddress(wallet.address)}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => copyToClipboard(wallet.address, "address")}
              >
                {copiedItem === "address" ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <Card>
        <CardContent className="p-6 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-foreground">${wallet.balanceUSD}</div>
            <div className="text-muted-foreground">
              {wallet.balance} {wallet.chain.name}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button className="h-12 flex flex-col space-y-1">
          <Send className="h-5 w-5" />
          <span className="text-sm">Send</span>
        </Button>
        <Button
          variant="outline"
          className="h-12 flex flex-col space-y-1 bg-transparent"
          onClick={() => setShowReceiveModal(true)}
        >
          <Download className="h-5 w-5" />
          <span className="text-sm">Receive</span>
        </Button>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {DUMMY_TRANSACTIONS.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    transaction.type === "send" ? "bg-red-100" : "bg-green-100"
                  }`}
                >
                  {transaction.type === "send" ? (
                    <ArrowUpRight className="h-5 w-5 text-red-600" />
                  ) : (
                    <ArrowDownLeft className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{transaction.type === "send" ? "Sent" : "Received"}</div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.type === "send" ? "To" : "From"} {truncateAddress(transaction.address)}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`font-semibold ${transaction.type === "send" ? "text-red-600" : "text-green-600"}`}>
                  {transaction.type === "send" ? "-" : "+"}
                  {transaction.amount} {wallet.chain.name.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">{transaction.timestamp}</div>
              </div>
            </div>
          ))}

          {/* Transaction Details */}
          <div className="pt-4 border-t border-border">
            <div className="space-y-3">
              {DUMMY_TRANSACTIONS.slice(0, 1).map((transaction) => (
                <div key={`detail-${transaction.id}`} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Transaction Hash</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs">{truncateHash(transaction.hash)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0"
                        onClick={() => copyToClipboard(transaction.hash, `hash-${transaction.id}`)}
                      >
                        {copiedItem === `hash-${transaction.id}` ? (
                          <Check className="h-3 w-3 text-primary" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button size="sm" variant="ghost" className="h-4 w-4 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent">
            View All Transactions
          </Button>
        </CardContent>
      </Card>
    </div>
     <ReceiveModal
        open={showReceiveModal}
        onOpenChange={setShowReceiveModal}
        walletAddress={wallet.address}
        networkName={wallet.chain.name.charAt(0).toUpperCase() + wallet.chain.name.slice(1)}
        networkIcon={wallet.chain.icon}
      />
    </>
  )
}


