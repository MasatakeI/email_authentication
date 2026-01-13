// test/models/AuthModel.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  sendEmailVerification: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

import { auth } from "../../firebase/auth";

import { ModelError, MODEL_ERROR_CODE } from "../../models/errors/ModelError";

import {
  signUpUser,
  signInUser,
  signOutUser,
  subscribeAuth,
} from "../../models/AuthModel";

describe("AuthModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const email = "aaa@example.com";
  const password = "xxxxxx";

  describe("subscribeAuth", () => {
    test("Firebase のログイン状態の変化を監視して、ユーザー情報を変換して通知する", () => {
      const callback = vi.fn();

      onAuthStateChanged.mockImplementation((_, cb) => {
        cb({ uid: "test-id", email: "xxx@zzz.com", emailVerified: true });
        return vi.fn();
      });

      subscribeAuth(callback);

      expect(callback).toHaveBeenCalledWith({
        uid: "test-id",
        email: "xxx@zzz.com",
        emailVerified: true,
      });
    });
  });

  describe("signUpUser", () => {
    test("成功:ユーザー作成とメール認証が呼ばれる", async () => {
      const mockUser = {
        uid: "test-id",
        email: "xxx@zzz.com",
        emailVerified: false,
      };
      createUserWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      });

      sendEmailVerification.mockResolvedValue();

      const result = await signUpUser(email, password);

      expect(result).toEqual({
        uid: "test-id",
        email: "xxx@zzz.com",
        emailVerified: false,
      });

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        email,
        password
      );

      expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);
    });
    test("失敗:バリデーションエラー Firebaseは呼ばれない", async () => {
      await expect(signUpUser("", "")).rejects.toBeInstanceOf(ModelError);

      await expect(signUpUser("", "")).rejects.toMatchObject({
        code: MODEL_ERROR_CODE.VALIDATION,
        message: "メールアドレスとパスワードは必須です",
      });

      expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    });

    test("パスワード6文字未満", async () => {
      const invalidPassword = "aaa";
      await expect(signUpUser(email, invalidPassword)).rejects.toBeInstanceOf(
        ModelError
      );
      await expect(signUpUser(email, invalidPassword)).rejects.toMatchObject({
        code: MODEL_ERROR_CODE.VALIDATION,
        message: "パスワードは6文字以上です",
      });
    });

    test("Firebase エラーをそのまま投げる", async () => {
      const firebaseError = new Error("firebase error");

      createUserWithEmailAndPassword.mockRejectedValue(firebaseError);

      await expect(signUpUser(email, password)).rejects.toBe(firebaseError);
    });
  });

  describe("signInUser", () => {
    test("成功:ログイン成功時にユーザー情報を返す", async () => {
      const mockUser = {
        uid: "test-id",
        email: "xxx@zzz.com",
        emailVerified: false,
      };
      signInWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      });

      const email = "aaa@example.com";
      const password = "xxxxxx";
      const result = await signInUser(email, password);

      expect(result).toEqual({
        uid: "test-id",
        email: "xxx@zzz.com",
        emailVerified: false,
      });

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        email,
        password
      );
    });
    test("失敗:バリデーションエラー Firebaseは呼ばれない", async () => {
      await expect(signInUser("", "123")).rejects.toBeInstanceOf(ModelError);

      expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
    });

    test("失敗:Firebaseエラー", async () => {
      const firebaseError = new Error("firebase error");

      signInWithEmailAndPassword.mockRejectedValue(firebaseError);

      await expect(signInUser(email, password)).rejects.toBe(firebaseError);
    });
  });

  describe("signOutUser", () => {
    test("成功:signOutが呼ばれる", async () => {
      signOut.mockResolvedValue();

      await signOutUser();

      expect(signOut).toHaveBeenCalledWith(auth);
    });
    test("失敗:Firebseエラー", async () => {
      const firebaseError = new Error("firebase error");

      signOut.mockRejectedValue(firebaseError);

      await expect(signOutUser()).rejects.toBe(firebaseError);
    });
  });
});
