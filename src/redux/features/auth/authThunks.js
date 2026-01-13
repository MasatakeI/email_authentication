// redux/features/auth/authThunks.js

import {
  signInUser,
  signOutUser,
  signUpUser,
  subscribeAuth,
} from "../../../models/AuthModel";

import { clearUser, setAuthChecked, setUser } from "./authSlice";

import { createThunk } from "../../utils/createThunk";

import { showSnackbar } from "../snackbar/snackbarSlice";

import { mapAuthErrorToModelError } from "./mapAuthErrorToModelError";

export const initAuthAsync = () => (dispatch) => {
  const unsubscribe = subscribeAuth((user) => {
    if (user) {
      dispatch(setUser(user));
    } else {
      dispatch(clearUser());
    }

    dispatch(setAuthChecked());
  });

  return unsubscribe;
};

export const signUpUserAsync = createThunk(
  "auth/signUpUser",
  async ({ email, password }, thunkApi) => {
    try {
      const user = await signUpUser(email, password);

      thunkApi.dispatch(showSnackbar(`登録成功! 送信メールを確認してください`));
      return user;
    } catch (error) {
      throw mapAuthErrorToModelError(error);
      // return thunkApi.rejectWithValue(mapAuthErrorToModelError(error));
    }
  }
);

export const signInUserAsync = createThunk(
  "auth/signInUser",
  async ({ email, password }, thunkApi) => {
    try {
      const user = await signInUser(email, password);
      thunkApi.dispatch(showSnackbar(`ログイン成功`));
      return user;
    } catch (error) {
      throw mapAuthErrorToModelError(error);
      // return thunkApi.rejectWithValue(mapAuthErrorToModelError(error));
    }
  }
);
export const signOutUserAsync = createThunk(
  "auth/signOutUser",
  async (_, thunkApi) => {
    try {
      await signOutUser();
      thunkApi.dispatch(showSnackbar(`ログアウト成功`));
      return;
    } catch (error) {
      throw mapAuthErrorToModelError(error);
      // return thunkApi.rejectWithValue(mapAuthErrorToModelError(error));
    }
  }
);
