// src/test/redux/features/auth/mapAuthErrorToModel.test.js

import { describe, test, expect } from "vitest";

import { mapAuthErrorToModelError } from "../../../../redux/features/auth/mapAuthErrorToModelError";

import {
  ModelError,
  MODEL_ERROR_CODE,
} from "../../../../models/errors/ModelError";

describe("Firebase Auth エラーを ModelError に正規化する", () => {
  test("ModelErrorをそのまま正規化する", () => {
    const error = new ModelError(
      MODEL_ERROR_CODE.VALIDATION,
      "バリデーションエラー"
    );

    const result = mapAuthErrorToModelError(error);

    expect(result).toBe(error);
  });

  test.each([
    [
      "auth/email-already-in-use",
      MODEL_ERROR_CODE.VALIDATION,
      "このメールアドレスはすでに使用されています",
    ],
    [
      "auth/invalid-email",
      MODEL_ERROR_CODE.VALIDATION,
      "メールアドレスの形式が正しくありません",
    ],
    [
      "auth/weak-password",
      MODEL_ERROR_CODE.VALIDATION,
      "パスワードが弱すぎます",
    ],
    [
      "auth/wrong-password",
      MODEL_ERROR_CODE.AUTH_INVALID,
      "パスワードが正しくありません",
    ],
    [
      "auth/invalid-credential",
      MODEL_ERROR_CODE.AUTH_INVALID,
      "メールアドレスまたはパスワードが正しくありません",
    ],

    [
      "auth/user-not-found",
      MODEL_ERROR_CODE.NOT_FOUND,
      "ユーザーが存在しません",
    ],
    [
      "auth/too-many-requests",
      MODEL_ERROR_CODE.AUTH_FORBIDDEN,
      "しばらく時間をおいて再度お試しください",
    ],
    [
      "auth/network-request-failed",
      MODEL_ERROR_CODE.NETWORK,
      "ネットワークエラーが発生しました",
    ],
  ])("%s を正規化する", (firebaseCode, modelCode, message) => {
    const firebaseError = { code: firebaseCode };

    const result = mapAuthErrorToModelError(firebaseError);

    expect(result).toBeInstanceOf(ModelError);
    expect(result).toMatchObject({
      code: modelCode,
      message,
      cause: firebaseError,
    });
  });

  test("未知のauthエラーはFIRESTOREにフォールバックする", () => {
    const error = { code: "auth/some-new-error" };

    const result = mapAuthErrorToModelError(error);
    expect(result).toMatchObject({
      code: MODEL_ERROR_CODE.EXTERNAL,
      message: "認証エラーが発生しました",
    });
  });

  test("error.codeが存在しない場合,UNKNOWNを返す", () => {
    const error = new Error("@@@@@@");

    const result = mapAuthErrorToModelError(error);
    expect(result).toMatchObject({
      code: MODEL_ERROR_CODE.UNKNOWN,
      message: "予期せぬエラーが発生しました",
    });
  });
});
