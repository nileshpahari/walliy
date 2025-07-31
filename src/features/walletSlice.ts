import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WalletAccount } from "@/lib/types";
import { loadState } from "@/lib/loadState";

interface WalletsState {
  selectedWallet: WalletAccount | null;
  wallets: WalletAccount[];
}

const initialState: WalletsState = {
  selectedWallet: null,
  wallets: loadState("wallets") || [],
};

const walletsSlice = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    addWallet: (state, action: PayloadAction<WalletAccount>) => {
      state.wallets.push(action.payload);
    },
    removeWallet: (state, action: PayloadAction<{id: number}>) => {
      state.wallets = state.wallets.filter((wallet) => wallet.id !== action.payload.id);
    },
    selectWallet: (state, action: PayloadAction<WalletAccount | null>) => {
      state.selectedWallet = action.payload;
    },
    updateWallet: (state, action: PayloadAction<WalletAccount>) => {
      state.wallets = state.wallets.map((wallet) => {
        if (wallet.id === action.payload.id) {
          return action.payload;
        }
        return wallet;
      });
    },
    updateWallets: (state, action: PayloadAction<WalletAccount[]>) => {
      state.wallets = action.payload;
    },
    renameWallet: (state, action: PayloadAction<{id: number; name: string}>) => {
      state.wallets = state.wallets.map((wallet) => {
        if (wallet.id === action.payload.id) {
          return {
            ...wallet,
            name: action.payload.name,
          };
        }
        return wallet;
      });
    },
    // updateBalance: (state, action: PayloadAction<{ id: number; balance: number }>) => {
    //   state.wallets.find((wallet) => wallet.id === action.payload.id)?.balance = action.payload.balance;
    //   localStorage.setItem("wallets", JSON.stringify(state.wallets));
    // },
  },
});

export const { addWallet, removeWallet, selectWallet, renameWallet, updateWallet, updateWallets } = walletsSlice.actions;
export default walletsSlice.reducer;
