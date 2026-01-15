// src/redux/features/auth/authSelectors.js
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectUser = (state) => state.auth.user;
export const selectError = (state) => state.auth.error;
export const selectAuthChecked = (state) => state.auth.authChecked;
