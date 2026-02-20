// src/test/components/widgets/AuthForm/AuthFormView.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";

import { screen, render } from "@testing-library/react";

import AuthFormSection from "@/components/widgets/AuthForm/AuthFormSection";
import AuthFormView from "@/components/widgets/AuthForm/AuthFormView";
import { ExploreTwoTone } from "@mui/icons-material";

vi.mock("@/components/widgets/AuthForm/AuthFormSection", () => ({
  default: vi.fn(({ title }) => (
    <div data-testid={`section-${title}`}>{title}</div>
  )),
}));

describe("AuthFormView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSignUpState = {
    email: "signup@test.com",
    setEmail: vi.fn(),
    password: "zzz123",
    setPassword: vi.fn(),
    onSubmit: vi.fn(),
  };
  const mockSignInState = {
    email: "signin@test.com",
    setEmail: vi.fn(),
    password: "zzz456",
    setPassword: vi.fn(),
    onSubmit: vi.fn(),
  };

  test("登録のセクションが表示されAuthFormSectionに正しいpropsが渡される", () => {
    render(
      <AuthFormView
        isLoading={false}
        signUpState={mockSignUpState}
        signInState={mockSignInState}
      />,
    );

    expect(screen.getByTestId("section-登録")).toBeInTheDocument();
    expect(screen.getByTestId("section-ログイン")).toBeInTheDocument();

    // 登録セクションへのProps検証
    expect(AuthFormSection).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        title: "登録",
        email: "signup@test.com", // signUpStateから渡っているか
        onSubmit: mockSignUpState.onSubmit,
      }),
      undefined,
    );

    // ログインセクションへのProps検証
    expect(AuthFormSection).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        title: "ログイン",
        email: "signin@test.com", // signUpStateから渡っているか
        onSubmit: mockSignInState.onSubmit,
      }),
      undefined,
    );
  });

  test("isLoading=true の時 各セクションにisLoading=trueが伝わる", () => {
    render(
      <AuthFormView
        isLoading={true}
        signUpState={mockSignUpState}
        signInState={mockSignInState}
      />,
    );

    expect(AuthFormSection).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ isLoading: true }),
      undefined,
    );
  });
});
