import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CHAINS } from "@/lib/data";
import { Chain } from "@/lib/types";
import { loadState } from "@/lib/loadState";
interface ChainState {
  selectedChain: Chain;
}

const initialState: ChainState = {
  selectedChain: loadState("chain") || CHAINS[0],
};

const chainSlice = createSlice({
  name: "chain",
  initialState,
  reducers: {
    setChain: (state, action: PayloadAction<Chain>) => {
      state.selectedChain = action.payload;
    },
  },
});

export const { setChain } = chainSlice.actions;
export default chainSlice.reducer;
