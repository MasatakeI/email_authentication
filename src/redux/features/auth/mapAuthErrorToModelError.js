// redux/features/auth/mapAuthErrorToModelError.js

import {
  ModelError,
  MODEL_ERROR_CODE,
} from "../../../models/errors/ModelError";

export const mapAuthErrorToModelError = (error) => {
  if (error instanceof ModelError) {
    return error;
  }

  if (error?.code?.startsWith("auth/")) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return new ModelError(
          MODEL_ERROR_CODE.VALIDATION,
          "このメールアドレスはすでに使用されています"
        );

      case "auth/invalid-credential":
      case "auth/wrong-password":
        return new ModelError(
          MODEL_ERROR_CODE.FORBIDDEN,
          "メールアドレスまたはパスワードが正しくありません"
        );

      case "auth/user-not-found":
        return new ModelError(
          MODEL_ERROR_CODE.NOT_FOUND,
          "ユーザーが存在しません"
        );

      case "auth/too-many-requests":
        return new ModelError(
          MODEL_ERROR_CODE.FORBIDDEN,
          "しばらく時間をおいて再度お試しください"
        );

      default:
        return new ModelError(
          MODEL_ERROR_CODE.FIRESTORE,
          "認証エラーが発生しました"
        );
    }
  }

  return new ModelError(
    MODEL_ERROR_CODE.UNKNOWN,
    "予期せぬエラーが発生しました"
  );
};
