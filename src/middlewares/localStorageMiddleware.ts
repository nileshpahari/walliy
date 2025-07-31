// import { Middleware } from "@reduxjs/toolkit";
// import { addWallet, removeWallet, renameWallet } from "@/features/walletSlice";
// import { WalletAccount } from "@/lib/types";
// import { RootState } from "@/app/store";
// import { Action } from "@reduxjs/toolkit";

// export const walletMiddleware: Middleware =
//   (storeAPI) => (next) => (action: Action) => {
//     const result = next(action);

//     const actionsToWatch = [
//       addWallet.type,
//       removeWallet.type,
//       renameWallet.type,
//     ];

//     if (actionsToWatch.includes(action.type as string)) {
//       const wallets = storeAPI
//         .getState()
//         .wallets.wallets.map((wallet: WalletAccount) => ({
//           id: wallet.id,
//           name: wallet.name,
//           address: wallet.address,
//           chain: wallet.chain,
//         }));
//       localStorage.setItem("wallets", JSON.stringify(wallets));
//     }

//     return result;
//   };

import { Middleware } from "@reduxjs/toolkit";
import { setNetwork } from "@/features/networkSlice";
import { setChain } from "@/features/chainSlice";
import {
  addWallet,
  removeWallet,
  updateWallet,
  updateWallets,
  renameWallet,
} from "@/features/walletSlice";

export const localStorageMiddleware: Middleware = store => next => action => {
  const result = next(action);

  if (setNetwork.match(action)) {
    localStorage.setItem("network", JSON.stringify(action.payload));
  }

  if (setChain.match(action)) {
    localStorage.setItem("chain", JSON.stringify(action.payload));
  }

  if (
    addWallet.match(action) ||
    removeWallet.match(action) ||
    updateWallet.match(action) ||
    updateWallets.match(action) ||
    renameWallet.match(action)
  ) {
    const wallets = store.getState().wallets.wallets;
    localStorage.setItem("wallets", JSON.stringify(wallets));
  }

  return result;
};
