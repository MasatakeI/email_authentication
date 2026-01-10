// src/redux/features/auth/authSlice.js

import { createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import {
  signUpUserAsync,
  signInUserAsync,
  signOutUserAsync,
} from "./authThunks";

export const authInitialState = {
  user: null,
  isLoading: false,
  error: null,
  authChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },

    setAuthChecked: (state) => {
      state.authChecked = true;
    },
    clearUser: (state) => {
      state.user = null;
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

      //singOut
      .addCase(signOutUserAsync.fulfilled, (state, action) => {
        state.user = null;
      })
      // rejected共通処理
      .addMatcher(
        isRejectedWithValue(signUpUserAsync, signInUserAsync),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearAuthError, setAuthChecked, setUser, clearUser } =
  authSlice.actions;

export default authSlice.reducer;
