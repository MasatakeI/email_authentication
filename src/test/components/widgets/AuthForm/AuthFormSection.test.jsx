// src/test/components/widgets/AuthForm/AuthFormSection.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";

import { screen, render } from "@testing-library/react";

import AuthFormSection from "@/components/widgets/AuthForm/AuthFormSection";

import userEvent from "@testing-library/user-event";

describe("AuthFormSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const defaultProps = {
    title: "登録",
    emailId: "signup-email",
    passwordId: "signup-password",
    isLoading: false,

    onSubmit: vi.fn(),
    email: "",
    setEmail: vi.fn(),
    password: "",
    setPassword: vi.fn(),
  };

  test("formセクションが表示される", () => {
    render(<AuthFormSection {...defaultProps} />);

    expect(screen.getByRole("heading", { name: "登録" })).toBeInTheDocument();

    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "登録" })).toBeInTheDocument();
  });

  test("入力すると対応するsetterが呼ばれる", async () => {
    const user = userEvent.setup();
    render(<AuthFormSection {...defaultProps} />);

    await user.type(screen.getByLabelText("メールアドレス"), "xxx@zzz.com");
    await user.type(screen.getByLabelText("パスワード"), "aaaaaa");

    expect(defaultProps.setEmail).toHaveBeenCalled();
    expect(defaultProps.setPassword).toHaveBeenCalled();
  });

  test("ボタンを押すとonSubmitが呼ばれる", async () => {
    const user = userEvent.setup();
    render(<AuthFormSection {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "登録" }));
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  test("isLoading=trueの時,ボタンがdisabledになる", () => {
    render(<AuthFormSection {...defaultProps} isLoading={true} />);

    expect(screen.getByRole("button", { name: "登録" })).toBeDisabled();
  });
});
