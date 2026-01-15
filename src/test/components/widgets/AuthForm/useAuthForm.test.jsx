import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import * as authThunks from "../../../../redux/features/auth/authThunks";

import authReducer from "../../../../redux/features/auth/authSlice";
import { useAuthForm } from "../../../../components/widgets/AuthForm/useAuthForm";

const navigateMock = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const setup = (preloadedState) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  return { store, wrapper };
};

const baseState = {
  auth: {
    user: { uid: 123 },
    isLoading: false,
    error: null,
    authChecked: false,
  },
};

describe("useAuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("handleSignUp", () => {
    test("成功:signUpUserAsyncが正しいpayloadでdispatchされる", async () => {
      const spy = vi
        .spyOn(authThunks, "signUpUserAsync")
        .mockImplementation(() => () => ({
          unwrap: () => Promise.resolve(),
        }));
      const { wrapper } = setup(baseState);
      const { result } = renderHook(() => useAuthForm(), { wrapper });

      act(() => {
        result.current.setSignUpEmail("xxx@zzz.com");
        result.current.setSignUpPassword("yyyyyy");
      });

      await act(async () => {
        await result.current.handleSignUp({
          preventDefault: vi.fn(),
        });
      });

      expect(spy).toHaveBeenCalledWith({
        email: "xxx@zzz.com",
        password: "yyyyyy",
      });
    });
  });

  describe("handleSignIn", () => {
    test("成功: navigateが呼ばれる", async () => {
      const signInSpy = vi
        .spyOn(authThunks, "signInUserAsync")
        .mockImplementation(() => () => ({
          unwrap: () => Promise.resolve({ uid: "test-user" }),
        }));
      const { wrapper } = setup(baseState);
      const { result } = renderHook(() => useAuthForm(), { wrapper });

      act(() => {
        result.current.setSignInEmail("xxx@zzz.com");
        result.current.setSignInPassword("yyyyyy");
      });

      await act(async () => {
        result.current.handleSignIn({
          preventDefault: vi.fn(),
        });
      });

      expect(signInSpy).toHaveBeenCalledWith({
        email: "xxx@zzz.com",
        password: "yyyyyy",
      });

      expect(navigateMock).toHaveBeenCalledWith("/main");
    });
    test("失敗:navigateされない", async () => {
      vi.spyOn(authThunks, "signInUserAsync").mockImplementation(() => () => ({
        unwrap: () => Promise.reject(new Error("login failed")),
      }));
      const { wrapper } = setup(baseState);
      const { result } = renderHook(() => useAuthForm(), { wrapper });

      act(() => {
        result.current.setSignInEmail("xxx@zzz.com");
        result.current.setSignInPassword("yyyyyy");
      });

      await act(async () => {
        result.current.handleSignIn({
          preventDefault: vi.fn(),
        });
      });

      expect(navigateMock).not.toHaveBeenCalled();
    });
  });
});
