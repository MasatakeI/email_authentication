import { isRejectedWithValue } from "@reduxjs/toolkit";
import { showSnackbar } from "../features/snackbar/snackbarSlice";

export const snackbarMiddleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const message = action.payload?.message ?? "エラーが発生しました";
    store.dispatch(showSnackbar(message));
  }

  return next(action);
};
