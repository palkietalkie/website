import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  SignUp: () => <div data-testid="clerk-signup" />,
}));

import SignUpPage from "./page";

describe("SignUpPage", () => {
  test("mounts Clerk's SignUp component", () => {
    const { getByTestId } = render(<SignUpPage />);
    expect(getByTestId("clerk-signup")).toBeTruthy();
  });

  test("wraps the Clerk widget in a single container div", () => {
    // Mirrors SignInPage so both auth surfaces stay symmetrical — same `.wrap` layout, same DOM shape.
    const { container } = render(<SignUpPage />);
    const wrappers = container.querySelectorAll("div");
    expect(wrappers.length).toBe(2);
    expect(wrappers[0].firstElementChild).toBe(wrappers[1]);
  });
});
