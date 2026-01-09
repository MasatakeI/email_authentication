// test/redux/features/auth/normalizeAuthError.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import { normalizeAuthError } from "../../../../redux/features/auth/normalizeAuthError";

import { ModelError } from "../../../../models/errors/ModelError";
import { AUTH_ERROR_CODE } from "../../../../redux/features/auth/authErrorCodes";

describe("normalizeAuthError", () => {
  test("ModelErrorをそのまま正規化する", () => {
    const error = new ModelError(
      AUTH_ERROR_CODE.VALIDATION,
      "バリデーションエラー"
    );

    const result = normalizeAuthError(error);

    expect(result).toEqual({
      code: AUTH_ERROR_CODE.VALIDATION,
      message: "バリデーションエラー",
    });
  });

  test.each([
    [
      "auth/email-already-in-use",
      AUTH_ERROR_CODE.EMAIL_ALREADY_IN_USE,
      "このメールアドレスはすでに使用されています",
    ],
    [
      "auth/invalid-credential",
      AUTH_ERROR_CODE.INVALID_CREDENTIAL,
      "メールアドレスまたはパスワードが正しくありません",
    ],
    [
      "auth/wrong-password",
      AUTH_ERROR_CODE.INVALID_CREDENTIAL,
      "メールアドレスまたはパスワードが正しくありません",
    ],
    [
      "auth/user-not-found",
      AUTH_ERROR_CODE.USER_NOT_FOUND,
      "ユーザーが存在しません",
    ],
  ])("%s を正規化する", (log, errorCode, message) => {
    const error = {
      code: log,
    };

    const result = normalizeAuthError(error);

    expect(result).toEqual({
      code: errorCode,
      message,
    });
  });

  test("未知のauthエラーはAUTH_ERRORにフォールバックする", () => {
    const error = {
      code: "auth/xxxxx-yyyyy-zzzz",
    };

    const result = normalizeAuthError(error);
    expect(result).toEqual({
      code: AUTH_ERROR_CODE.AUTH_ERROR,
      message: "認証エラーが発生しました",
    });
  });

  test("error.codeが存在しない場合,UNKNOWNを返す", () => {
    const error = new Error("@@@@");

    const result = normalizeAuthError(error);
    expect(result).toEqual({
      code: AUTH_ERROR_CODE.UNKNOWN,
      message: "予期せぬエラーが発生しました",
    });
  });
});
