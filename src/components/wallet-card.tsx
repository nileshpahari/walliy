"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CHAINS } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Copy, Eye, Edit3, Trash2, Check } from "lucide-react";
import { truncateAddress } from "@/lib/truncateAddress";
import { WalletAccount } from "@/lib/types";
import { useState } from "react";
export default function WalletCard({
  wallet,
  onWalletSelect,
  handleWalletAction,
}: {
  wallet: WalletAccount;
  onWalletSelect: (wallet: WalletAccount) => void;
  handleWalletAction: (action: string, wallet: WalletAccount) => void;
}) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const chain = CHAINS.find((chain) => chain.id === wallet.chain.id);
  return (
    <Card
      key={wallet.id}
      className="cursor-pointer hover:bg-accent transition-colors border-border"
      onClick={() => onWalletSelect(wallet)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {chain?.icon && (
              <img src={chain.icon} alt={chain.name} className="h-6 w-6" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground">{wallet.name}</div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="font-mono">
                  {truncateAddress(wallet.address)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWalletAction("copy", wallet);
                    setCopiedAddress(wallet.address);
                    setTimeout(() => setCopiedAddress(null), 2000);
                  }}
                >
                  {copiedAddress === wallet.address ? (
                    <Check className="h-3 w-3 text-primary" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* {typeof window !== "undefined" && ( */}
            <div className="text-right">
                <div className="font-semibold text-foreground">
                  ${wallet.balanceUSD}
                </div>
              <div className="text-sm text-muted-foreground">
                {wallet.balance} {wallet.chain.ticker}
              </div>
            </div>
              {/* )} */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4 " />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuItem
                  onClick={() => handleWalletAction("rename", wallet)}
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Rename Wallet
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleWalletAction("copy", wallet)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Address
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleWalletAction("private-key", wallet)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Show Private Key
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleWalletAction("remove", wallet)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Wallet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
