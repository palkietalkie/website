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
});
