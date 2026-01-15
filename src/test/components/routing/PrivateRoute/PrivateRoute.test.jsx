// test/src/components/routing/PrivateRoute/PrivateRoute.jsx

import { render, screen } from "@testing-library/react";
import { vi, beforeEach, expect } from "vitest";
import PrivateRoute from "@/components/routing/PrivateRoute/PrivateRoute";
import { useSelector } from "react-redux";

import {
  selectAuthChecked,
  selectUser,
} from "@/redux/features/auth/authSelectors";

//　モック

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("react-router", () => ({
  Navigate: ({ to }) => <p>Navigate to {to}</p>,
}));

describe("PrivateRoute", () => {
  const renderRoute = () =>
    render(
      <PrivateRoute>
        <p>protected content</p>
      </PrivateRoute>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("認証確認中はローディング表示", () => {
    useSelector.mockImplementation((selector) => {
      if (selector === selectAuthChecked) return false;
      if (selector === selectUser) return null;
    });

    renderRoute();

    expect(screen.getByText(/認証確認中/)).toBeInTheDocument();
  });

  test("未ログインの時は / にリダイレクト", () => {
    useSelector.mockImplementation((selector) => {
      if (selector === selectAuthChecked) return true;
      if (selector === selectUser) return null;
    });

    renderRoute();

    expect(screen.getByText("Navigate to /")).toBeInTheDocument();
  });

  test("email未確認の場合は / にリダイレクト", () => {
    useSelector.mockImplementation((selector) => {
      if (selector === selectAuthChecked) return true;
      if (selector === selectUser) return { emailVerified: false };
    });

    renderRoute();

    expect(screen.getByText("Navigate to /")).toBeInTheDocument();
  });

  test("認証済み&email確認済みならchildrenを表示", () => {
    useSelector.mockImplementation((selector) => {
      if (selector === selectAuthChecked) return true;
      if (selector === selectUser) return { emailVerified: true };
    });

    renderRoute();

    expect(screen.getByText("protected content")).toBeInTheDocument();
  });
});
