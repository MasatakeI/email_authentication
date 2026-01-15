// src/redux/features/snackbar/snackbarSlice.js

import { createSlice } from "@reduxjs/toolkit";

export const snackbarInitialState = {
  open: false,
  message: "",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: snackbarInitialState,

  reducers: {
    showSnackbar: (state, action) => {
      state.open = true;
      state.message = action.payload;
    },

    hideSnackbar: (state) => {
      state.open = false;
    },

    clearSnackbar: () => snackbarInitialState,
  },
});

export const { showSnackbar, hideSnackbar, clearSnackbar } =
  snackbarSlice.actions;
export default snackbarSlice.reducer;
