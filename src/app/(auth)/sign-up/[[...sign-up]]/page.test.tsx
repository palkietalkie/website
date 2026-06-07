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
});
