import { isRejectedWithValue } from "@reduxjs/toolkit";
import { showSnackbar } from "../features/snackbar/snackbarSlice";

export const snackbarMiddleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const message = action.payload?.message ?? "エラーが発生しました";
    next(showSnackbar(message));
  }

  return next(action);
};
