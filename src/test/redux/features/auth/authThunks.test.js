// test/redux/features/auth/authThunks.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  signUpUserAsync,
  signInUserAsync,
  signOutUserAsync,
} from "../../../../redux/features/auth/authThunks";

import {
  signInUser,
  signOutUser,
  signUpUser,
} from "../../../../models/AuthModel";

vi.mock("../../../../models/AuthModel", () => ({
  signInUser: vi.fn(),
  signOutUser: vi.fn(),
  signUpUser: vi.fn(),
}));

import { normalizeAuthError } from "../../../../redux/features/auth/normalizeAuthError";
vi.mock("../../../../redux/features/auth/normalizeAuthError", () => ({
  normalizeAuthError: vi.fn(),
}));

import { ModelError } from "../../../../models/errors/ModelError";
import { mockUser } from "../../fixtures/authFixture";

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

  describe("signUpUserAsync", () => {
    test("成功:サインアップしたuser情報を返す", async () => {
      mockSuccess(signUpUser, mockUser);

      const result = await callThunk(signUpUserAsync, {
        email: mockUser.email,
        password: mockUser.password,
      });

      expect(result.payload).toEqual(mockUser);
      expect(signUpUser).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.password
      );
    });
    test("失敗:ModelErrorの場合,rejectWithValueのpayloadを返す", async () => {
      const normalizedError = {
        code: "VALIDATION",
        message: "エラー",
      };

      mockError(signUpUser, normalizedError.code, normalizedError.message);

      normalizeAuthError.mockReturnValue(normalizedError);

      const result = await callThunk(signUpUserAsync, {
        email: "",
        password: "",
      });

      expect(result.payload).toEqual(normalizedError);
      expect(normalizeAuthError).toHaveBeenCalled();
    });
  });

  describe("signInUserAsync", () => {
    test("成功:サインインしたuser情報を返す", async () => {
      mockSuccess(signInUser, mockUser);

      const result = await callThunk(signInUserAsync, {
        email: mockUser.email,
        password: mockUser.password,
      });

      expect(result.payload).toEqual(mockUser);
      expect(signInUser).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.password
      );
    });
    test("失敗:ModelErrorの場合,rejectWithValueのpayloadを返す", async () => {
      const normalizedError = {
        code: "VALIDATION",
        message: "エラー",
      };

      mockError(signInUser, normalizedError.code, normalizedError.message);

      normalizeAuthError.mockReturnValue(normalizedError);

      const result = await callThunk(signInUserAsync, {
        email: "",
        password: "",
      });

      expect(result.payload).toEqual(normalizedError);
      expect(normalizeAuthError).toHaveBeenCalled();
    });
  });

  describe("signOutUserAsync", () => {
    test("成功:signOutUserが呼ばれる", async () => {
      mockSuccess(signOutUser);
      const result = await callThunk(signOutUserAsync);
      expect(result.payload).toBe(undefined);
      expect(signOutUser).toHaveBeenCalledTimes(1);
    });
    test("失敗:ModelErrorの場合,rejectWithValueのpayloadを返す", async () => {
      const normalizedError = {
        code: "VALIDATION",
        message: "エラー",
      };

      mockError(signOutUser, normalizedError.code, normalizedError.message);

      normalizeAuthError.mockReturnValue(normalizedError);

      const result = await callThunk(signOutUserAsync, {
        email: "",
        password: "",
      });

      expect(result.payload).toEqual(normalizedError);
      expect(normalizeAuthError).toHaveBeenCalled();
    });
  });
});
