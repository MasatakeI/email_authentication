// src/components/widgets/AuthForm/AuthForm.jsx

import "./AuthForm.css";

import { useAuthForm } from "./useAuthForm";
import AuthFormView from "./AuthFormView";

const AuthForm = () => {
  const {
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
  } = useAuthForm();

  return (
    <AuthFormView
      isLoading={isLoading}
      handleSignIn={handleSignIn}
      handleSignUp={handleSignUp}
      signUpEmail={signUpEmail}
      setSignUpEmail={setSignUpEmail}
      signUpPassword={signUpPassword}
      setSignUpPassword={setSignUpPassword}
      signInEmail={signInEmail}
      setSignInEmail={setSignInEmail}
      signInPassword={signInPassword}
      setSignInPassword={setSignInPassword}
    />
  );
};

export default AuthForm;
