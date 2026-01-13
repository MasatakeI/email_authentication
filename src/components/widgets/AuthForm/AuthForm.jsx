// src/components/widgets/AuthForm/AuthForm.jsx

import React, { useState } from "react";
import "./AuthForm.css";

import { useDispatch, useSelector } from "react-redux";
import { selectIsLoading } from "../../../redux/features/auth/authSelectors";

import {
  signUpUserAsync,
  signInUserAsync,
} from "../../../redux/features/auth/authThunks";

import { useNavigate } from "react-router";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const AuthForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectIsLoading);

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
    <div>
      <Box sx={{ flexGrow: 1 }} className="auth-box">
        <Grid className="form-container" container spacing={3}>
          {/* 登録 */}
          <Grid size={{ xs: 12, sm: 6 }} className="form sign-up">
            <h2>登録</h2>
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
          </Grid>

          {/* ログイン */}
          <Grid size={{ xs: 12, sm: 6 }} className="form sign-in">
            <h2>ログイン</h2>
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
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default AuthForm;
