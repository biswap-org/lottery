import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GET_WALLET_ADDRESS } from "../constants/ActionTypes";
import { BigNumberish } from "@ethersproject/bignumber";

// Define a type for the slice state
interface walletState {
  walletAddress: string;
  balance: BigNumberish;
  network: string;
  selectedNetwork: string;
  selectedWallet: string;
  tokenList: any[];
}
// Define the initial state using that type
const initialState: walletState = {
  walletAddress: "",
  balance: 0.0,
  network: "",
  selectedNetwork: "",
  selectedWallet: "",
  tokenList: [],
} as walletState;

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
    setSelectedNetwork: (state, action: PayloadAction<string>) => {
      state.selectedNetwork = action.payload;
    },
    setSelectedWallet: (state, action: PayloadAction<string>) => {
      state.selectedWallet = action.payload;
    },
    setTokenList: (state, action: PayloadAction<any[]>) => {
      state.tokenList = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setWalletAddress, setBalance, setSelectedNetwork, setSelectedWallet, setTokenList } = walletSlice.actions;
export const walletActions = walletSlice.actions;
export default walletSlice.reducer;
