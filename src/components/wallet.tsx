"use client";
import { getSolanaBalance } from "@/lib/getAccnBalance";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Chain,
  CHAINS,
  WalletAccount,
} from "@/lib/data";
import {
  SolWallet,
  EthWallet,
  genSolKeys,
} from "@/app/actions/generateKeyPairs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Copy,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Check,
} from "lucide-react";
import { AccountDetail } from "@/components/account-details";
import { useMemo } from "react";

export default function WalletList() {
const [wallets, setWallets] = useState<WalletAccount[]>([]);
useEffect(() => {
  async function fetchBalances() {
    const updated = await Promise.all(
      wallets.map(async (wallet) => {
        if (wallet.chain.id === "solana") {
          const balance = await getSolanaBalance(wallet.address);
          return {
            ...wallet,
            balance,
            balanceUSD: balance * 150, 
          };
        }
        return wallet;
      })
    );
    setWallets(updated);
  }

  if (wallets.length > 0) fetchBalances();
}, [wallets.length]);

useEffect(() => {
  const stored = localStorage.getItem("wallets");
  if (stored) setWallets(JSON.parse(stored));
}, []);

  const onWalletSelect = (wallet: WalletAccount) => {
    setSelectedWallet(wallet);
  };
  const [selectedWallet, setSelectedWallet] = useState<WalletAccount | null>(
    null
  );
  const [selectedChain, setselectedChain] = useState<Chain>(CHAINS[0]);
  const [copiedAddress, setCopiedAddress] = useState<number | null>(null);

  const selectedChainData = CHAINS.find((n) => n.id === selectedChain.id);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text: string, walletId: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedAddress(walletId);
    setTimeout(() => setCopiedAddress(null), 2000);
  };
  const filteredWallets = useMemo(() => {
  return wallets.filter(
    (wallet) => wallet.chain.id === selectedChain.id
  );
}, [wallets, selectedChain]);


  const handleAddWallet = (chain: Chain) => {
    const mnemonic = localStorage.getItem("mnemonic");
    if(!mnemonic) return;
    if (chain.id === "solana") {
      const { address, privateKey } = genSolKeys(
        mnemonic,
        wallets.length + 1
      );
      const newWallet = new SolWallet(wallets.length + 1, address);
      console.log(newWallet);
      setWallets([...wallets, newWallet]);
      localStorage.setItem("wallets", JSON.stringify([...wallets, newWallet]));
    }
  }
    const handleWalletAction = (action: string, wallet: WalletAccount) => {
      switch (action) {
        case "copy":
          copyToClipboard(wallet.address, wallet.id);
          break;
        case "rename":
          console.log("Rename wallet:", wallet.name);
          break;
        case "private-key":
          console.log("Show private key for:", wallet.name);
          break;
        case "remove":
          console.log("Remove wallet:", wallet.name);
          setWallets(wallets.filter((w) => w.id !== wallet.id));
          localStorage.setItem("wallets", JSON.stringify(wallets.filter((w) => w.id !== wallet.id)));
          break;
      }
    };

    return !selectedWallet ? (
      <div className="w-full max-w-md mx-auto space-y-4 min-h-[calc(100vh-4rem)]">
        {/* Chain Selector */}
        <Select
          value={selectedChain.id}
          onValueChange={(value) =>
            setselectedChain(CHAINS.find((n) => n.id === value) as Chain)
          }
        >
          <SelectTrigger className="w-full bg-card border-border">
            <SelectValue>
              <div className="flex items-center space-x-2">
            
                  {/* {selectedChainData?.icon} */}
                  {CHAINS.find((chain) => chain.id === selectedChain.id)?.icon && (
                    <img src={CHAINS.find((chain) => chain.id === selectedChain.id)?.icon} alt={CHAINS.find((chain) => chain.id === selectedChain.id)?.name} className="h-6 w-6" />
                  )}
                <span>{selectedChainData?.name}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {CHAINS.map((chain) => (
              <SelectItem key={chain.id} value={chain.id}>
                <div className="flex items-center space-x-2">
                  <img src={chain.icon} alt={chain.name} className="h-6 w-6" />
                  <span>{chain.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Wallet List */}
        <div className="space-y-2">
          {filteredWallets.map((wallet: WalletAccount) => (
            <Card
              key={wallet.id}
              className="cursor-pointer hover:bg-accent transition-colors border-border"
              onClick={() => onWalletSelect(wallet)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {CHAINS.find((chain) => chain.id === wallet.chain.id)?.icon && (
                      <img src={CHAINS.find((chain) => chain.id === wallet.chain.id)?.icon} alt={CHAINS.find((chain) => chain.id === wallet.chain.id)?.name} className="h-6 w-6" />
                    )}
                      <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground">
                        {wallet.name}
                      </div>
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
                            copyToClipboard(wallet.address, wallet.id);
                          }}
                        >
                          {copiedAddress === wallet.id ? (
                            <Check className="h-3 w-3 text-primary" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        ${wallet.balanceUSD}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {wallet.balance}{" "}
                        {selectedChainData?.name.slice(0, 3).toUpperCase()}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
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
                          onClick={() =>
                            handleWalletAction("private-key", wallet)
                          }
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
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full bg-transparent border-dashed border-primary text-primary hover:bg-primary/10"
          onClick={() => handleAddWallet(selectedChain)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new {selectedChainData?.name} wallet
        </Button>
      </div>
    ) : (
      <AccountDetail
        wallet={selectedWallet}
        onBack={() => setSelectedWallet(null)}
      />
    );
  };
