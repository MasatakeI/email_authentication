// redux/features/auth/authThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";

import { signInUser, signOutUser, signUpUser } from "../../../models/AuthModel";

import { normalizeAuthError } from "./normalizeAuthError";

export const signUpUserAsync = createAsyncThunk(
  "auth/signUpUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await signUpUser(email, password);

      return user;
    } catch (error) {
      return rejectWithValue(normalizeAuthError(error));
    }
  }
);

export const signInUserAsync = createAsyncThunk(
  "auth/signInUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await signInUser(email, password);

      return user;
    } catch (error) {
      return rejectWithValue(normalizeAuthError(error));
    }
  }
);
export const signOutUserAsync = createAsyncThunk(
  "auth/signOutUser",
  async (_, { rejectWithValue }) => {
    try {
      await signOutUser();
      return;
    } catch (error) {
      return rejectWithValue(normalizeAuthError(error));
    }
  }
);
