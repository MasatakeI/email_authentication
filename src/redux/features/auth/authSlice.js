// src/redux/features/auth/authSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  signUpUserAsync,
  signInUserAsync,
  signOutUserAsync,
} from "./authThunks";

export const authInitialState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
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
      .addCase(signInUserAsync.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.user = null;
      })
      .addCase(signInUserAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        state.isLoading = false;
      })

      .addCase(signInUserAsync.rejected, (state, action) => {
        state.user = null;
        state.isLoading = false;
        state.error = action.payload;
      })

      //singOut
      .addCase(signOutUserAsync.fulfilled, (state, action) => {
        state.user = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
