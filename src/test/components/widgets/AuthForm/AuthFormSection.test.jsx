// src/test/components/widgets/AuthForm/AuthFormSection.test.jsx

import { describe, test, expect, vi } from "vitest";

import { screen, render, fireEvent } from "@testing-library/react";

import AuthFormSection from "../../../../components/widgets/AuthForm/AuthFormSection";

const setup = (props = {}) => {
  const defaultProps = {
    title: "登録",
    onSubmit: vi.fn(),
    emailId: "signup-email",
    email: "",
    setEmail: vi.fn(),
    passwordId: "signup-password",
    password: "",
    setPassword: vi.fn(),
    isLoading: false,
  };

  render(<AuthFormSection {...defaultProps} {...props} />);
  return defaultProps;
};

describe("AuthFormSection", () => {
  test("formセクションが表示される", () => {
    setup();

    expect(screen.getByRole("heading", { name: "登録" })).toBeInTheDocument();

    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "登録" })).toBeInTheDocument();
  });

  test("入力すると対応するsetterが呼ばれる", () => {
    const setEmail = vi.fn();
    const setPassword = vi.fn();

    setup({ setEmail, setPassword });

    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "xxx@zzz.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "aaaaaa" },
    });

    expect(setEmail).toHaveBeenCalledWith("xxx@zzz.com");
    expect(setPassword).toHaveBeenCalledWith("aaaaaa");
  });

  test("ボタンを押すとonSubmitが呼ばれる", () => {
    const onSubmit = vi.fn();

    setup({ onSubmit });

    fireEvent.click(screen.getByRole("button", { name: "登録" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test("isLoading=trueの時,ボタンがdisabledになる", () => {
    setup({ isLoading: true });

    expect(screen.getByRole("button", { name: "登録" })).toBeDisabled();
  });
});
