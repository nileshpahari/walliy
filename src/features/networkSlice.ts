import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Network } from "@/lib/types";
import { loadState } from "@/lib/loadState";

interface NetworkState {
  selectedNetwork: Network;
}

const initialState: NetworkState = {
  selectedNetwork: loadState("network") || Network.MAINNET,
};

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setNetwork: (state, action: PayloadAction<Network>) => {
      state.selectedNetwork = action.payload;
    },
  },
});

export const { setNetwork } = networkSlice.actions;
export default networkSlice.reducer;

