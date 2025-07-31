import { Middleware } from "@reduxjs/toolkit";
import { addWallet, removeWallet, renameWallet } from "@/features/walletSlice";
import { RootState } from "@/app/store";
import { WalletAccount } from "@/lib/types";

export const walletMiddleware: Middleware<{}, RootState> =
  (storeAPI) => (next) => (action) => {
    const result = next(action);

    const actionsToWatch = [
      addWallet.type,
      removeWallet.type,
      renameWallet.type,
    ];

    if (actionsToWatch.includes(action.type)) {
      const wallets = storeAPI
        .getState()
        .wallets.wallets.map((wallet: WalletAccount) => ({
          id: wallet.id,
          name: wallet.name,
          address: wallet.address,
          chain: wallet.chain,
        }));
      localStorage.setItem("wallets", JSON.stringify(wallets));
    }

    return result;
  };
