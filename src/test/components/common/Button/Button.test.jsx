import { describe, expect, test, vi, beforeEach } from "vitest";
import { screen, render } from "@testing-library/react";

import Button from "@/components/common/Button/Button";
import userEvent from "@testing-library/user-event";

describe("Button", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("childrenが表示される", () => {
    render(<Button onClickHandler={() => {}}>送信</Button>);
    expect(screen.getByRole("button", { name: "送信" }));
  });

  test("クリック時にonClickHandlerが呼ばれる", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClickHandler={onClick}>送信</Button>);

    const button = screen.getByRole("button", { name: "送信" });

    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("clickable=false の時 disabledになる", async () => {
    render(
      <Button onClickHandler={() => {}} clickable={false}>
        送信
      </Button>,
    );

    const button = screen.getByRole("button", { name: "送信" });

    expect(button).toBeDisabled();
  });

  test("variant に応じたクラスが付与される", async () => {
    render(
      <Button onClickHandler={() => {}} variant="secondary">
        送信
      </Button>,
    );

    const button = screen.getByRole("button", { name: "送信" });

    expect(button).toHaveClass("button button-secondary");
  });

  test("デフォルトの props で正しいクラスと活性状態を持つ", () => {
    render(<Button onClickHandler={() => {}}>デフォルト</Button>);
    const button = screen.getByRole("button", { name: "デフォルト" });

    expect(button).toHaveClass("button button-primary");
    expect(button).not.toBeDisabled();
  });
});
