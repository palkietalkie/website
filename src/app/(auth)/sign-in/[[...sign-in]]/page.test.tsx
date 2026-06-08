import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  SignIn: () => <div data-testid="clerk-signin" />,
}));

import SignInPage from "./page";

describe("SignInPage", () => {
  test("mounts Clerk's SignIn component", () => {
    const { getByTestId } = render(<SignInPage />);
    expect(getByTestId("clerk-signin")).toBeTruthy();
  });

  test("wraps the Clerk widget in a single container div", () => {
    // Layout container is the (auth)/auth.module.css `.wrap` style; we don't assert the hashed class name but we do assert exactly one wrapper around the Clerk node so a refactor doesn't accidentally drop it.
    const { container } = render(<SignInPage />);
    const wrappers = container.querySelectorAll("div");
    // outer wrap div + inner SignIn stub div
    expect(wrappers.length).toBe(2);
    expect(wrappers[0].firstElementChild).toBe(wrappers[1]);
  });
});
