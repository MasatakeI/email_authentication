// src/redux/utils/features/createThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";

import { ModelError } from "../../models/errors/ModelError";

export const createThunk = (type, fn) =>
  createAsyncThunk(type, async (arg, thunkApi) => {
    try {
      return await fn(arg, thunkApi);
    } catch (error) {
      if (error instanceof ModelError) {
        return thunkApi.rejectWithValue({
          code: error.code,
          message: error.message,
        });
      }

      return thunkApi.rejectWithValue({
        code: "UNKNOWN",
        message: "予期せぬエラーが発生しました",
      });
    }
  });
