// src/redux/features/auth/mapAuthErrorToModelError.js

import {
  ModelError,
  MODEL_ERROR_CODE,
} from "../../../models/errors/ModelError";

const AUTH_ERROR_MAP = {
  "auth/email-already-in-use": {
    code: MODEL_ERROR_CODE.VALIDATION,
    message: "このメールアドレスはすでに使用されています",
  },
  "auth/invalid-email": {
    code: MODEL_ERROR_CODE.VALIDATION,
    message: "メールアドレスの形式が正しくありません",
  },
  "auth/weak-password": {
    code: MODEL_ERROR_CODE.VALIDATION,
    message: "パスワードが弱すぎます",
  },

  "auth/wrong-password": {
    code: MODEL_ERROR_CODE.AUTH_INVALID,
    message: "パスワードが正しくありません",
  },
  "auth/invalid-credential": {
    code: MODEL_ERROR_CODE.AUTH_INVALID,
    message: "メールアドレスまたはパスワードが正しくありません",
  },
  "auth/user-not-found": {
    code: MODEL_ERROR_CODE.NOT_FOUND,
    message: "ユーザーが存在しません",
  },

  "auth/too-many-requests": {
    code: MODEL_ERROR_CODE.AUTH_FORBIDDEN,
    message: "しばらく時間をおいて再度お試しください",
  },
  "auth/network-request-failed": {
    code: MODEL_ERROR_CODE.NETWORK,
    message: "ネットワークエラーが発生しました",
  },
};

export const mapAuthErrorToModelError = (error) => {
  if (error instanceof ModelError) {
    return error;
  }

  if (error?.code?.startsWith("auth/")) {
    const mapped = AUTH_ERROR_MAP[error.code];

    if (mapped) {
      return new ModelError({
        code: mapped.code,
        message: mapped.message,
        cause: error,
      });
    }

    return new ModelError({
      code: MODEL_ERROR_CODE.EXTERNAL,
      message: "認証エラーが発生しました",
      cause: error,
    });
  }

  return new ModelError({
    code: MODEL_ERROR_CODE.UNKNOWN,
    message: "予期せぬエラーが発生しました",
    cause: error,
  });
};
