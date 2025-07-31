"use client";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Send,
  Download,
  Copy,
  Check,
  Loader,
  Loader2,
} from "lucide-react";
import { ReceiveModal } from "./receive-modal";
import { SendModal } from "./send-modal";
import { truncateAddress } from "@/lib/truncateAddress";
import { Transactions } from "@/components/transactions";
import { sendSol } from "@/lib/sendSol";
import { sendEth } from "@/lib/sendEth";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { selectWallet } from "@/features/walletSlice";

export function AccountDetail() {
  // states
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [copied, setCopied] = useState<boolean>(false);

  const wallet = useSelector(
    (state: RootState) => state.wallets.selectedWallet
  );

  const dispatch = useDispatch();

  const onBack = () => {
    dispatch(selectWallet(null));
  };

  if (!wallet)
    return (
      <div className="w-full max-w-lg mx-auto space-y-6 min-h-[calc(100vh-4rem)] flex items-center justify-center text-2xl">
        Wallet not found
      </div>
    );

  return (
    <>
      <div className="w-full max-w-lg mx-auto space-y-6 min-h-[calc(100vh-4rem)]">
        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={onBack}
            className="h-8 w-8 p-0 cursor-pointer hover:text-primary hover:bg-transparent dark:hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <img
              src={wallet.chain.icon}
              alt={wallet.chain.name}
              className="w-8 h-8"
            />
            <div>
              <h1 className="font-semibold text-lg">{wallet.name}</h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="font-mono">
                  {truncateAddress(wallet.address)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 cursor-pointer hover:text-primary hover:bg-transparent dark:hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(wallet.address, setCopied);
                  }}
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-primary" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">
                ${wallet.balanceUSD}
              </div>
              <div className="text-muted-foreground">
                {wallet.balance} {wallet.chain.ticker}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button
            className="h-12 flex items-center space-y-1 cursor-pointer"
            onClick={() => setShowSendModal(true)}
          >
            <Send className="h-5 w-5" />
            <span className="text-sm">Send</span>
          </Button>
          <Button
            variant="outline"
            className="h-12 flex items-center space-y-1 bg-transparent cursor-pointer"
            onClick={() => setShowReceiveModal(true)}
          >
            <Download className="h-5 w-5" />
            <span className="text-sm">Receive</span>
          </Button>
        </div>
        <Suspense fallback={<Loader2 className="animate-spin" size={48} />}>
          <Transactions wallet={wallet} />
        </Suspense>
      </div>
      <ReceiveModal
        open={showReceiveModal}
        onOpenChange={setShowReceiveModal}
        wallet={wallet}
      />
      <SendModal
        open={showSendModal}
        onOpenChange={setShowSendModal}
        wallet={wallet}
        onSend={wallet.chain.id === "solana" ? sendSol : sendEth}
      />
    </>
  );
}
