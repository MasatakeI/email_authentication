// src/components/widgets/AuthForm/AuthForm.jsx

import React, { useState } from "react";
import "./AuthForm.css";

import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectIsLoading,
  selectError,
} from "../../../redux/features/auth/authSelectors";

import {
  signUpUserAsync,
  signInUserAsync,
} from "../../../redux/features/auth/authThunks";

import { useNavigate } from "react-router";

const AuthForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        signUpUserAsync({
          email: signUpEmail,
          password: signUpPassword,
        })
      ).unwrap();

      // alert("メールを確認してください");
    } catch {
    } finally {
      setSignUpEmail("");
      setSignUpPassword("");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        signInUserAsync({
          email: signInEmail,
          password: signInPassword,
        })
      ).unwrap();

      navigate("/main");
    } catch {
    } finally {
      setSignInEmail("");
      setSignInPassword("");
    }
  };

  return (
    <div className="App">
      <div className="form-container">
        {/* 登録 */}
        <div className="form sign-up">
          <h2>登録フォーム</h2>
          <form onSubmit={handleSignUp} className="auth-form">
            <label>メールアドレス</label>
            <input
              type="email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
            />

            <label>パスワード</label>
            <input
              type="password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
            />

            <button type="submit" disabled={isLoading} className="btn">
              登録
            </button>
          </form>
        </div>

        {/* ログイン */}
        <div className="form sign-in">
          <h2>ログインフォーム</h2>
          <form onSubmit={handleSignIn} className="auth-form">
            <label>メールアドレス</label>
            <input
              type="email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
            />

            <label>パスワード</label>
            <input
              type="password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
            />

            <button type="submit" disabled={isLoading} className="btn">
              ログイン
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
