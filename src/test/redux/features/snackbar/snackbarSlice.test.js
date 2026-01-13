// src/test/redux/snackbar/snackbarSlice.test.js

import { describe, test, expect } from "vitest";

import snackbarSlice, {
  snackbarInitialState,
  showSnackbar,
  hideSnackbar,
  clearSnackbar,
} from "../../../../redux/features/snackbar/snackbarSlice";

describe("snackbarSlice", () => {
  test("初期値のテスト", () => {
    expect(snackbarInitialState).toEqual({
      open: false,
      message: "",
    });
  });

  test("showSnackbar:スナックバーを開き,messageを設定する", () => {
    const action = showSnackbar("ログイン成功");
    const state = snackbarSlice(snackbarInitialState, action);
    expect(state).toEqual({
      open: true,
      message: "ログイン成功",
    });
  });

  test("hideSnackbar:スナックバーを閉じる", () => {
    const prev = {
      open: true,
      message: "ログイン成功",
    };

    const action = hideSnackbar();
    const state = snackbarSlice(prev, action);
    expect(state).toEqual({
      open: false,
      message: "ログイン成功",
    });
  });
  test("clearSnackbar:スナックバーの状態を初期に戻す", () => {
    const prev = {
      open: true,
      message: "ログイン成功",
    };

    const action = clearSnackbar();
    const state = snackbarSlice(prev, action);
    expect(state).toEqual({
      open: false,
      message: "",
    });
  });
});
