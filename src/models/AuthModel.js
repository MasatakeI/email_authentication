// models/AuthModel.js

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../auth/auth";

import { ModelError, MODEL_ERROR_CODE } from "./errors/ModelError";

const AUTH_MESSAGES = {
  REQUIRED: "メールアドレスとパスワードは必須です",
  PASSWORD_LENGTH: "パスワードは6文字以上です",
};

const validateEmailAndPassword = (email, password) => {
  if (!email || !password) {
    throw new ModelError(MODEL_ERROR_CODE.VALIDATION, AUTH_MESSAGES.REQUIRED);
  }

  if (password.length < 6) {
    throw new ModelError(
      MODEL_ERROR_CODE.VALIDATION,
      AUTH_MESSAGES.PASSWORD_LENGTH
    );
  }
};

export const signUpUser = async (email, password) => {
  validateEmailAndPassword(email, password);
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  await sendEmailVerification(user);

  return user;
};

export const signInUser = async (email, password) => {
  validateEmailAndPassword(email, password);
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  return user;
};

export const signOutUser = async () => {
  await signOut(auth);
};
