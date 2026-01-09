// test/redux/features/auth/authSlice.js
import { describe, test, expect } from "vitest";

import {
  signUpUserAsync,
  signInUserAsync,
  signOutUserAsync,
} from "../../../../redux/features/auth/authThunks";

import authSlice, {
  clearAuthError,
  authInitialState,
} from "../../../../redux/features/auth/authSlice";

import { mockUser } from "../../fixtures/authFixture";

//ヘルパー関数
const applyPending = (slice, thunk, prev = authInitialState) =>
  slice(prev, thunk.pending());

const applyFulfilled = (slice, thunk, payload, prev) =>
  slice(prev, thunk.fulfilled(payload));

const applyRejected = (slice, thunk, error, prev) =>
  slice(prev, thunk.rejected(null, "requestId", undefined, error));

describe("authSlice", () => {
  test("初期状態のテスト", () => {
    expect(authInitialState).toEqual({
      user: null,
      isLoading: false,
      error: null,
    });
  });

  describe("reducer", () => {
    test("clearAuthError:エラーをクリアする", () => {
      const prev = {
        user: null,
        isLoading: false,
        error: "エラー",
      };

      const action = clearAuthError();
      const state = authSlice(prev, action);
      expect(state).toEqual({
        user: null,
        isLoading: false,
        error: null,
      });
    });
  });

  describe("extraReducer", () => {
    describe("signUpUserAsync", () => {
      const pending = applyPending(authSlice, signUpUserAsync);

      test("成功:pendingからfulfilledに遷移しuser情報を設定する", () => {
        const fulfilled = applyFulfilled(
          authSlice,
          signUpUserAsync,
          mockUser,
          pending
        );

        expect(fulfilled).toEqual({
          isLoading: false,
          user: mockUser,
          error: null,
        });
      });

      test("失敗:pendingからrejectedに遷移しerrorを設定する", () => {
        const error = "エラー";
        const rejected = applyRejected(
          authSlice,
          signUpUserAsync,
          error,
          pending
        );

        expect(rejected).toEqual({
          user: null,
          isLoading: false,
          error: error,
        });
      });
    });

    describe("signInUserAsync", () => {
      const pending = applyPending(authSlice, signInUserAsync);

      test("成功:pendingからfulfilledに遷移しuser情報を設定する", () => {
        const fulfilled = applyFulfilled(
          authSlice,
          signInUserAsync,
          mockUser,
          pending
        );

        expect(fulfilled).toEqual({
          isLoading: false,
          user: mockUser,
          error: null,
        });
      });

      test("失敗:pendingからrejectedに遷移しerrorを設定する", () => {
        const error = "エラー";
        const rejected = applyRejected(
          authSlice,
          signInUserAsync,
          error,
          pending
        );

        expect(rejected).toEqual({
          user: null,
          isLoading: false,
          error: error,
        });
      });
    });

    describe("signOutUserAsync", () => {
      test("成功:user情報をnullに設定する", () => {
        const prev = {
          isLoading: false,
          user: mockUser,
          error: null,
        };

        const fulfilled = applyFulfilled(authSlice, signOutUserAsync, {}, prev);
        expect(fulfilled).toMatchObject({
          user: null,
        });
      });
    });
  });
});
