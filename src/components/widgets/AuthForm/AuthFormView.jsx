// src/components/widgets/AuthForm/AuthFormView.jsx

import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AuthFormSection from "./AuthFormSection";

const AuthFormView = ({ isLoading, signUpState, signInState }) => {
  return (
    <Box sx={{ flexGrow: 1 }} className="auth-box">
      <Grid className="form-container" container spacing={3}>
        {/* 登録 */}
        <Grid size={{ xs: 12, sm: 6 }} className="form sign-up">
          <AuthFormSection
            title={"登録"}
            emailId={"signup-email"}
            passwordId={"signup-password"}
            isLoading={isLoading}
            {...signUpState}
          />
        </Grid>

        {/* ログイン */}
        <Grid size={{ xs: 12, sm: 6 }} className="form sign-in">
          <AuthFormSection
            title={"ログイン"}
            emailId={"signin-email"}
            passwordId={"signin-password"}
            isLoading={isLoading}
            {...signInState}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuthFormView;
