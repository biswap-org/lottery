/**
 * This file is used to manage `theme` state at app level using Redux
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from ".";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: "light",
};

const theme = createSlice({
  name: "theme",
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
  },
});

export const selectThemeMode = (state: RootState) => state.theme.mode;

export const {
  updateTheme,
} = theme.actions;

export default theme.reducer;
