import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { truncateAddress } from "@/lib/truncateAddress";
import { WalletAccount } from "@/lib/types";
import { Button } from "./ui/button";

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


export const Transactions = ({wallet}: {wallet: WalletAccount}) => {
    return (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {DUMMY_TRANSACTIONS.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${transaction.type === "send" ? "bg-red-100" : "bg-green-100"
                      }`}
                  >
                {transaction.type === "send" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
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

            <Button variant="outline" className="w-full bg-transparent">
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      )
}
