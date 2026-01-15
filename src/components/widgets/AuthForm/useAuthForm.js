// src/components/widgets/AuthForm/useAuthForm.js

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoading } from "../../../redux/features/auth/authSelectors";

import {
  signUpUserAsync,
  signInUserAsync,
} from "../../../redux/features/auth/authThunks";

import { useNavigate } from "react-router";

export const useAuthForm = () => {
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

      setSignUpEmail("");
      setSignUpPassword("");
    } catch (err) {
      console.error(err);
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

      setSignInEmail("");
      setSignInPassword("");
    } catch (err) {
      console.error(err);
    }
  };

  return {
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
  };
};
