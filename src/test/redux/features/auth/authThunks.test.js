// src/test/redux/features/auth/authThunks.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  signUpUserAsync,
  signInUserAsync,
  signOutUserAsync,
  initAuthAsync,
} from "@/redux/features/auth/authThunks";

import {
  clearUser,
  setAuthChecked,
  setUser,
} from "@/redux/features/auth/authSlice";

import {
  signInUser,
  signOutUser,
  signUpUser,
  subscribeAuth,
} from "@/models/AuthModel";

vi.mock("@/models/AuthModel", () => ({
  signInUser: vi.fn(),
  signOutUser: vi.fn(),
  signUpUser: vi.fn(),
  subscribeAuth: vi.fn(),
}));

vi.mock("@/redux/features/auth/authSlice", () => ({
  clearUser: vi.fn(),
  setAuthChecked: vi.fn(),
  setUser: vi.fn(),
}));

import { mapAuthErrorToModelError } from "@/redux/features/auth/mapAuthErrorToModelError";
vi.mock("@/redux/features/auth/mapAuthErrorToModelError", () => ({
  mapAuthErrorToModelError: vi.fn(),
}));

import { MODEL_ERROR_CODE, ModelError } from "@/models/errors/ModelError";
import { mockUser } from "@/test/redux/fixtures/authFixture";

// ヘルパー関数
const mockSuccess = (fn, value) => fn.mockResolvedValue(value);
const mockError = (fn, code, message) =>
  fn.mockRejectedValue(new ModelError(code, message));

const dispatch = vi.fn();
const getState = vi.fn();

const callThunk = async (thunk, params) =>
  thunk(params)(dispatch, getState, undefined);

describe("authThunks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initUserAsync", () => {
    test("認証状態が変化した時に setUserとsetAuthCheckedが dispatchされる", async () => {
      let authCallback;

      subscribeAuth.mockImplementation((cb) => {
        authCallback = cb;
        return vi.fn();
      });

      const unsubscribe = initAuthAsync()(dispatch);
      authCallback(mockUser);

      expect(dispatch).toHaveBeenCalledWith(setUser(mockUser));
      expect(dispatch).toHaveBeenCalledWith(setAuthChecked());

      authCallback(null);
      expect(dispatch).toHaveBeenCalledWith(clearUser());

      expect(typeof unsubscribe).toBe("function");
    });
  });

  describe("正常系 共通処理 ", () => {
    test.each([
      {
        title: "signUpUserAsync",
        fn: signUpUser,
        value: mockUser,
        thunk: signUpUserAsync,
        params: {
          email: mockUser.email,
          password: mockUser.password,
        },
      },
      {
        title: "signInUserAsync",
        fn: signInUser,
        value: mockUser,
        thunk: signInUserAsync,
        params: {
          email: mockUser.email,
          password: mockUser.password,
        },
      },
      {
        title: "signOutUserAsync",
        fn: signOutUser,
        value: undefined,
        thunk: signOutUserAsync,
        params: undefined,
      },
    ])("$title", async ({ fn, thunk, value, params }) => {
      mockSuccess(fn, value);

      const result = await callThunk(thunk, params);

      expect(result.payload).toEqual(value);

      if (params) {
        expect(fn).toHaveBeenCalledWith(mockUser.email, mockUser.password);
      } else {
        expect(fn).toHaveBeenCalledWith();
      }

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining("showSnackbar"),
        }),
      );
    });
  });

  describe("異常系 共通処理 : ModelErrorの場合,rejectWithValueのpayloadを返す", () => {
    test.each([
      {
        fn: signUpUser,
        thunk: signUpUserAsync,
        title: "signUpUserAsync",
      },
      {
        fn: signInUser,
        thunk: signInUserAsync,
        title: "signInUserAsync",
      },
      {
        fn: signOutUser,
        thunk: signOutUserAsync,
        title: "signOutUserAsync",
      },
    ])("$title の時", async ({ fn, thunk }) => {
      const normalizedError = new ModelError({
        code: MODEL_ERROR_CODE.VALIDATION,
        message: "エラー",
      });

      mockError(fn, normalizedError.code, normalizedError.message);

      mapAuthErrorToModelError.mockReturnValue(normalizedError);

      const result = await callThunk(thunk, {
        email: "",
        password: "",
      });

      expect(result.payload).toEqual({
        code: MODEL_ERROR_CODE.VALIDATION,
        message: "エラー",
      });
      expect(mapAuthErrorToModelError).toHaveBeenCalled();
    });
  });
});
