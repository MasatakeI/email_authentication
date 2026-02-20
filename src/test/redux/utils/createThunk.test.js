// src/test/redux/features/utils/createThunk.js
import { describe, test, expect, vi } from "vitest";

import { createThunk } from "@/redux/utils/createThunk";

import { ModelError } from "@/models/errors/ModelError";

const dispatch = vi.fn();
const getState = vi.fn();

describe("createThunk", () => {
  test("fn終了時はfulfilledになる", async () => {
    const thunk = createThunk("test/success", async () => {
      return "Success";
    });

    const result = await thunk()(dispatch, getState, undefined);

    expect(result.type).toBe("test/success/fulfilled");
    expect(result.payload).toBe("Success");
  });

  test("ModelErrorの場合 rejectWithValueされる", async () => {
    const thunk = createThunk("test/error", async () => {
      throw new ModelError({ code: "VALIDATION", message: "入力必須です" });
    });

    const result = await thunk()(dispatch, getState, undefined);

    expect(result.type).toBe(thunk.rejected.type);
    expect(result.payload).toEqual({
      code: "VALIDATION",
      message: "入力必須です",
    });

    expect(result.meta.rejectedWithValue).toBe(true);
  });

  test("ModelError以外はUNKOWNでrejectされる", async () => {
    const thunk = createThunk("test/unkownError", async () => {
      throw new Error("予期せぬエラーが発生しました");
    });

    const result = await thunk()(dispatch, getState, undefined);
    expect(result.type).toBe(thunk.rejected.type);
    expect(result.payload).toEqual({
      code: "UNKNOWN",
      message: "予期せぬエラーが発生しました",
    });

    expect(result.meta.rejectedWithValue).toBe(true);
  });
});
