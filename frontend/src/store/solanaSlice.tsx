import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GET_WALLET_ADDRESS } from "../constants/ActionTypes";
import { BigNumberish } from "@ethersproject/bignumber";

// Define a type for the slice state
interface solanaWalletState {
  walletAddress: string;
  balance: BigNumberish;
  network: string;
}
// Define the initial state using that type
const initialState: solanaWalletState = {
  walletAddress: "",
  balance: 0.0,
  network: "",
} as solanaWalletState;

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletAddress: (state, action: PayloadAction<string>) => {
      state.walletAddress = action.payload;
    },
    setBalance: (state, action: PayloadAction<BigNumberish>) => {
      state.balance = action.payload;
    },
    setNetworkName: (state, action: PayloadAction<string>) => {
      state.network = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWalletAddress, setBalance } = walletSlice.actions;
export const solanaWalletActions = walletSlice.actions;
export default walletSlice.reducer;
