// src/test/components/widgets/AuthForm/AuthFormView.test.jsx

import { describe, test, expect, vi } from "vitest";

import { screen, render } from "@testing-library/react";

import AuthFormSection from "../../../../components/widgets/AuthForm/AuthFormSection";
import AuthFormView from "../../../../components/widgets/AuthForm/AuthFormView";

vi.mock("../../../../components/widgets/AuthForm/AuthFormSection", () => ({
  default: vi.fn(({ title }) => (
    <div data-testid={`section-${title}`}>{title}</div>
  )),
}));

describe("AuthFormView", () => {
  test("登録,ログインのセクションが表示されAuthFormSectionに正しいpropsが渡される", () => {
    render(
      <AuthFormView
        isLoading={true}
        handleSignIn={vi.fn()}
        handleSignUp={vi.fn()}
        signUpEmail="a"
        setSignUpEmail={vi.fn()}
        signUpPassword="b"
        setSignUpPassword={vi.fn()}
        signInEmail="a"
        setSignInEmail={vi.fn()}
        signInPassword="b"
        setSignInPassword={vi.fn()}
      />
    );

    expect(screen.getByTestId("section-登録")).toBeInTheDocument();
    expect(screen.getByTestId("section-ログイン")).toBeInTheDocument();

    expect(AuthFormSection.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        title: "登録",
        email: "a",
        password: "b",
        isLoading: true,
      })
    );

    expect(AuthFormSection.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        title: "ログイン",
        email: "a",
        password: "b",
        isLoading: true,
      })
    );
  });
});
