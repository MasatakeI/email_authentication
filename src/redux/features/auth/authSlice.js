// redux/features/auth/authSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  signInUserAsync,
  signOutUserAsync,
  signUpUserAsync,
} from "./authThunks";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state, action) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      //signUp
      .addCase(signUpUserAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(signUpUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signUpUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload;
      })

      //signIn
      .addCase(signInUserAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })

      //singOut
      .addCase(signOutUserAsync.fulfilled, (state, action) => {
        state.user = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
