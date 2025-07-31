"use client";
import { getSolanaBalance } from "@/lib/getAccnBalance";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CHAINS } from "@/lib/data";
import { SolWallet, genSolKeys } from "@/app/actions/generateKeyPairs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { AccountDetail } from "@/components/wallet-details";
import Loader from "@/components/loader";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addWallet,
  removeWallet,
  renameWallet,
  selectWallet,
  updateWallets,
} from "@/features/walletSlice";
import { Chain, WalletAccount } from "@/lib/types";
import { toast } from "sonner";
import { RootState } from "@/app/store";
import WalletCard from "@/components/wallet-card";
import { setChain } from "@/features/chainSlice";
import useSolConnection from "@/hooks/useSolConnection";
import { fetchMnemonic } from "@/lib/fetchMnemonic";

export default function WalletList() {
  // redux states
  const wallets: WalletAccount[] = useSelector(
    (state: RootState) => state.wallets.wallets
  );
  const selectedWallet = useSelector(
    (state: RootState) => state.wallets.selectedWallet
  );
  const selectedChain = useSelector(
    (state: RootState) => state.chains.selectedChain
  );

  const selectedNetwork = useSelector(
    (state: RootState) => state.networks.selectedNetwork
  );

  // vars
  const connection = useSolConnection();
  const dispatch = useDispatch();
  const selectedChainData = CHAINS.find((n) => n.id === selectedChain.id);

  // functions
  const onWalletSelect = (wallet: WalletAccount) => {
    dispatch(selectWallet(wallet));
  };

  const copyToClipboard = async (text: string, walletId: number) => {
    if (typeof window !== "undefined") {
      await navigator.clipboard.writeText(text);
      toast("Address copied to clipboard");
      setCopiedAddress(walletId);
    }
    setTimeout(() => setCopiedAddress(null), 2000);
  };
  const filteredWallets = useMemo(() => {
    return wallets.filter((wallet) => wallet.chain.id === selectedChain.id);
  }, [wallets, selectedChain]);

  const handleAddWallet = async (chain: Chain) => {
    const mnemonic = await fetchMnemonic();
    if (!mnemonic) return;
    if (chain.id === "solana") {
      const { address, privateKey } = genSolKeys(mnemonic, wallets.length + 1);
      const newWallet = new SolWallet(wallets.length + 1, address);
      console.log(newWallet);
      dispatch(addWallet(newWallet));
    }
  };

  const handleWalletAction = (action: string, wallet: WalletAccount) => {
    switch (action) {
      case "copy":
        copyToClipboard(wallet.address, wallet.id);
        break;
      case "rename":
        dispatch(renameWallet(wallet));
        break;
      case "private-key":
        console.log("Show private key for:", wallet.name);
        break;
      case "remove":
        dispatch(removeWallet(wallet));
        toast("Wallet removed");
        break;
    }
  };

  // states
  const [copiedAddress, setCopiedAddress] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [fetching, setIsFetching] = useState(false);
  // let toastIdRef = useRef<string | null>(null);

  // effects
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(()=>{
    if(mounted) toast("Etherium is not supported yet", { duration: 5000 });
  }, [mounted])
  useEffect(() => {
    if (!wallets.length || !connection) return;
    let cancelled = false;

    async function fetchAndUpdateBalances() {
      setIsFetching(true);
      const updatedWallets = await Promise.all(
        wallets.map(async (wallet) => {
          if (wallet.chain.id !== "solana") return wallet;
          try {
            const balance = await getSolanaBalance(connection, wallet.address);
            return { ...wallet, balance, balanceUSD: balance * 150 };
          } catch {
            toast("Failed to fetch wallet details", { duration: 3000 });
            return { ...wallet, balance: 0, balanceUSD: 0 };
          }
        })
      );

      if (!cancelled) dispatch(updateWallets(updatedWallets));
      setIsFetching(false);
    }

    fetchAndUpdateBalances();
    return () => {
      cancelled = true;
    };
  }, [wallets.length, connection, dispatch, selectedNetwork, selectedChain]);

  if (!mounted)
    return (
      <div className="w-full max-w-lg mx-auto space-y-4 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader />
      </div>
    ); // Prevent hydration mismatches

  // useEffect(() => {
  //   if (fetching) {
  //     if (!toastIdRef.current) {
  //       toastIdRef.current = toast("Fetching wallet details...", { duration: Infinity });
  //     }
  //   } else {
  //     if (toastIdRef.current) {
  //       toast.dismiss(toastIdRef.current);
  //       toastIdRef.current = null;
  //     }
  //   }
  // }, [fetching]);

  return !selectedWallet ? (
    <div className="w-full max-w-lg mx-auto space-y-4 min-h-[calc(100vh-4rem)]">
      <Select
        value={selectedChain.id}
        onValueChange={(value) =>
          dispatch(
            setChain(CHAINS.find((chain) => chain.id === value) as Chain)
          )
        }
      >
        <SelectTrigger className="w-full bg-card border-border">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <img
                src={selectedChainData?.icon}
                alt={selectedChainData?.name}
                className="h-6 w-6"
              />
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

      <div className="space-y-2">
        {filteredWallets.map((wallet: WalletAccount) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            onWalletSelect={onWalletSelect}
            handleWalletAction={handleWalletAction}
          />
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
    <AccountDetail />
  );
}
