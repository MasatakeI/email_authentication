// test/redux/features/auth/mapAuthErrorToModel.test.js

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
      "auth/invalid-credential",
      MODEL_ERROR_CODE.FORBIDDEN,
      "メールアドレスまたはパスワードが正しくありません",
    ],
    [
      "auth/wrong-password",
      MODEL_ERROR_CODE.FORBIDDEN,
      "メールアドレスまたはパスワードが正しくありません",
    ],
    [
      "auth/user-not-found",
      MODEL_ERROR_CODE.NOT_FOUND,
      "ユーザーが存在しません",
    ],
  ])("%s を正規化する", (firebaseCode, expectedCode, message) => {
    const firebaseError = { code: firebaseCode };

    const result = mapAuthErrorToModelError(firebaseError);

    expect(result).toBeInstanceOf(ModelError);
    expect(result).toMatchObject({
      code: expectedCode,
      message,
    });
  });

  test("未知のauthエラーはFIRESTOREにフォールバックする", () => {
    const error = { code: "auth/some-new-error" };

    const result = mapAuthErrorToModelError(error);
    expect(result).toMatchObject({
      code: MODEL_ERROR_CODE.AUTH,
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
