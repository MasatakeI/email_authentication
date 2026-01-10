import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import snackbarReducer from "../features/snackbar/snackbarSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  snackbar: snackbarReducer,
});
