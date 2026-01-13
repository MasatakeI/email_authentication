// src/test/redux/middleware/snackbarMiddleware.test.js
import { describe, test, expect, vi } from "vitest";
import { snackbarMiddleware } from "../../../redux/middleware/snackbarMiddleware";
import { showSnackbar } from "../../../redux/features/snackbar/snackbarSlice";

vi.mock("@reduxjs/toolkit", async () => {
  const actual = await vi.importActual("@reduxjs/toolkit");

  return {
    ...actual,
    isRejectedWithValue: vi.fn(),
  };
});
import { isRejectedWithValue } from "@reduxjs/toolkit";

describe("snackbarMiddleware", () => {
  test("rejectWithValueされたactionでsnackbarをdispatchする", () => {
    isRejectedWithValue.mockReturnValue(true);

    const dispatch = vi.fn();
    const next = vi.fn();
    const store = { dispatch };

    const middleware = snackbarMiddleware(store)(next);

    const action = {
      payload: {
        message: "ログイン失敗",
      },
    };

    middleware(action);

    expect(dispatch).toHaveBeenCalledWith(showSnackbar("ログイン失敗"));

    expect(next).toHaveBeenCalledWith(action);
  });

  test("payload.messageが無い場合はデフォルト文言", () => {
    isRejectedWithValue.mockReturnValue(true);
    const dispatch = vi.fn();
    const next = vi.fn();

    const store = { dispatch };
    const middleware = snackbarMiddleware(store)(next);

    const action = {
      payload: {},
    };

    middleware(action);

    expect(dispatch).toHaveBeenCalledWith(showSnackbar("エラーが発生しました"));
  });

  test("isRejectedWithValueがfalseの場合はdispatchを呼ばない", () => {
    isRejectedWithValue.mockReturnValue(false);
    const dispatch = vi.fn();
    const next = vi.fn();

    const store = { dispatch };
    const middleware = snackbarMiddleware(store)(next);

    const action = {
      payload: {
        message: "ログイン成功",
      },
    };

    middleware(action);

    expect(dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });
});
