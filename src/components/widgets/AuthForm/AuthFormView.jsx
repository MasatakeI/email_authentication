// src/components/widgets/AuthForm/AuthFormView.jsx

import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AuthFormSection from "./AuthFormSection";

const AuthFormView = ({
  isLoading,
  handleSignIn,
  handleSignUp,
  signUpEmail,
  setSignUpEmail,
  signUpPassword,
  setSignUpPassword,
  signInEmail,
  setSignInEmail,
  signInPassword,
  setSignInPassword,
}) => {
  return (
    <Box sx={{ flexGrow: 1 }} className="auth-box">
      <Grid className="form-container" container spacing={3}>
        {/* 登録 */}
        <Grid size={{ xs: 12, sm: 6 }} className="form sign-up">
          <AuthFormSection
            title={"登録"}
            onSubmit={handleSignUp}
            emailId={"signup-email"}
            email={signUpEmail}
            setEmail={setSignUpEmail}
            passwordId={"signup-password"}
            password={signUpPassword}
            setPassword={setSignUpPassword}
            isLoading={isLoading}
          />
        </Grid>

        {/* ログイン */}
        <Grid size={{ xs: 12, sm: 6 }} className="form sign-in">
          <AuthFormSection
            title={"ログイン"}
            onSubmit={handleSignIn}
            emailId={"signin-email"}
            email={signInEmail}
            setEmail={setSignInEmail}
            passwordId={"signin-password"}
            password={signInPassword}
            setPassword={setSignInPassword}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuthFormView;
