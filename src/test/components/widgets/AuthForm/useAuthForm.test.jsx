// src/test/components/widgets/AuthForm/useAuthForm.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";
import { act } from "@testing-library/react";

import * as authThunks from "@/redux/features/auth/authThunks";

import authReducer, { authInitialState } from "@/redux/features/auth/authSlice";
import snackbarReducer from "@/redux/features/snackbar/snackbarSlice";
import { useAuthForm } from "../../../../components/widgets/AuthForm/useAuthForm";
import { snackbarInitialState } from "@/redux/features/snackbar/snackbarSlice";
import { renderHookWithStore } from "@/test/utils/renderHookWithStore";

const navigateMock = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("useAuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  const commonOptions = {
    reducers: {
      auth: authReducer,
      snackbar: snackbarReducer,
    },
    preloadedState: {
      auth: { ...authInitialState },
      snackbar: { ...snackbarInitialState },
    },
  };

  describe("正常系 共通処理:thunk関数が正しいpayloadでdispatchされる", () => {
    test.each([
      {
        title: "handleSignUp",
        thunk: "signUpUserAsync",
        stateKey: "signUpState",
        typeKey: "auth/signUp/pending",
      },
      {
        title: "handleSignIn",
        thunk: "signInUserAsync",
        stateKey: "signInState",
        typeKey: "auth/signIn/pending",
      },
    ])("$title", async ({ thunk, stateKey, typeKey }) => {
      const spy = vi.spyOn(authThunks, thunk).mockReturnValue({
        type: typeKey,
        unwrap: () => Promise.resolve({}),
      });
      const { result } = renderHookWithStore({
        hook: () => useAuthForm(),
        ...commonOptions,
      });

      act(() => {
        result.current[stateKey].setEmail("xxx@zzz.com");
        result.current[stateKey].setPassword("yyyyyy");
      });

      await act(async () => {
        await result.current[stateKey].onSubmit({
          preventDefault: vi.fn(),
        });
      });

      expect(spy).toHaveBeenCalledWith({
        email: "xxx@zzz.com",
        password: "yyyyyy",
      });

      expect(result.current[stateKey].email).toBe("");
      expect(result.current[stateKey].password).toBe("");

      if (thunk === "signInUserAsync") {
        expect(navigateMock).toHaveBeenCalledWith("/main");
      }
    });
  });

  describe("バリデーション 共通処理 : isLoading=trueの時 dispatchされない", () => {
    test.each([
      {
        title: "handleSignUp",
        thunk: "signUpUserAsync",
        stateKey: "signUpState",
        typeKey: "auth/signUp/pending",
      },
      {
        title: "handleSignIn",
        thunk: "signInUserAsync",
        stateKey: "signInState",
        typeKey: "auth/signIn/pending",
      },
    ])("$title", async ({ thunk, stateKey, typeKey }) => {
      const spy = vi.spyOn(authThunks, thunk).mockReturnValue({
        type: typeKey,
        unwrap: () => Promise.resolve({}),
      });
      const { result } = renderHookWithStore({
        hook: () => useAuthForm(),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          auth: { ...authInitialState, isLoading: true },
        },
      });

      act(() => {
        result.current[stateKey].setEmail("xxx@zzz.com");
        result.current[stateKey].setPassword("yyyyyy");
      });

      await act(async () => {
        await result.current[stateKey].onSubmit({
          preventDefault: vi.fn(),
        });
      });

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("異常系 共通処理 : stateは更新されない", () => {
    test.each([
      {
        title: "handleSignUp",
        thunk: "signUpUserAsync",
        stateKey: "signUpState",
        typeKey: "auth/signUp/rejected",
      },
      {
        title: "handleSignIn",
        thunk: "signInUserAsync",
        stateKey: "signInState",
        typeKey: "auth/signIn/rejected",
      },
    ])("$title", async ({ thunk, stateKey, typeKey }) => {
      vi.spyOn(authThunks, thunk).mockReturnValue({
        type: typeKey,
        unwrap: () => Promise.reject(new Error("エラー")),
      });
      const { result } = renderHookWithStore({
        hook: () => useAuthForm(),
        ...commonOptions,
      });

      act(() => {
        result.current[stateKey].setEmail("xxx@zzz.com");
      });

      await act(async () => {
        await result.current[stateKey].onSubmit({
          preventDefault: vi.fn(),
        });
      });
      expect(result.current[stateKey].email).toBe("xxx@zzz.com");
      expect(console.error).toHaveBeenCalled();
    });
  });
});
