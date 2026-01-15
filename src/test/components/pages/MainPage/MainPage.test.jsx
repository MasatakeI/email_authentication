import { describe, test, expect, vi, beforeEach } from "vitest";

import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import MainPage from "@/components/pages/MainPage/MainPage";

// モック
const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock("@/redux/features/auth/authThunks", () => ({
  signOutUserAsync: vi.fn(() => ({
    type: "auth/signOutUserAsync",
  })),
}));

describe("MainPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockDispatch.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue(),
    });
  });

  test("ログイン成功メッセージとログアウトボタンが表示される", async () => {
    render(<MainPage />);

    expect(screen.getByText("ログイン成功")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ログアウト" })
    ).toBeInTheDocument();
  });

  test("ログアウトボタンを押すとnavigateが呼ばれる", async () => {
    render(<MainPage />);

    const logoutButton = screen.getByRole("button", { name: "ログアウト" });

    const user = userEvent.setup();
    await user.click(logoutButton);

    expect(mockDispatch).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("ログアウト失敗:navigateが呼ばれない", async () => {
    mockDispatch.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(new Error("sign out failed")),
    });

    render(<MainPage />);

    const logoutButton = screen.getByRole("button", { name: "ログアウト" });

    const user = userEvent.setup();
    await user.click(logoutButton);

    expect(mockDispatch).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
