// redux/features/auth/normalizeAuthError.js

import { ModelError } from "../../../models/errors/ModelError";
import { AUTH_ERROR_CODE } from "./authErrorCodes";

export const normalizeAuthError = (error) => {
  if (error instanceof ModelError) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  if (error?.code?.startsWith("auth/")) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return {
          code: AUTH_ERROR_CODE.EMAIL_ALREADY_IN_USE,
          message: "このメールアドレスはすでに使用されています",
        };

      case "auth/invalid-credential":
      case "auth/wrong-password":
        return {
          code: AUTH_ERROR_CODE.INVALID_CREDENTIAL,
          message: "メールアドレスまたはパスワードが正しくありません",
        };

      case "auth/user-not-found":
        return {
          code: AUTH_ERROR_CODE.USER_NOT_FOUND,
          message: "ユーザーが存在しません",
        };
      default:
        return {
          code: AUTH_ERROR_CODE.AUTH_ERROR,
          message: "認証エラーが発生しました",
        };
    }
  }

  return {
    code: AUTH_ERROR_CODE.UNKNOWN,
    message: "予期せぬエラーが発生しました",
  };
};
