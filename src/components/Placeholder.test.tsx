import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Placeholder } from "@/components/Placeholder";

describe("Placeholder", () => {
  it("renders the label as visible text", () => {
    render(<Placeholder shape="phone" label="HERO IMAGE" spec="iPhone 15 hero, 1290x2796" />);
    expect(screen.getByText("HERO IMAGE")).toBeInTheDocument();
  });

  it("renders the spec inside a <figcaption>", () => {
    // <figcaption> is semantic — keeps the spec text in the same a11y subtree as the figure for screen readers reviewing the design.
    const { container } = render(
      <Placeholder shape="square" label="L" spec="512x512, brand colors only" />,
    );
    const cap = container.querySelector("figcaption");
    expect(cap).not.toBeNull();
    expect(cap!.textContent).toBe("512x512, brand colors only");
  });

  it("wraps the content in a <figure>", () => {
    const { container } = render(<Placeholder shape="wide" label="L" spec="S" />);
    expect(container.querySelector("figure")).not.toBeNull();
  });

  it("applies shape-specific class names on the figure", () => {
    // CSS Modules in tests produce class names like "Placeholder_phone__hash" — we check by substring, not equality, since hashes vary per build.
    const { container, rerender } = render(<Placeholder shape="phone" label="L" spec="S" />);
    expect(container.querySelector("figure")!.className).toMatch(/phone/);
    rerender(<Placeholder shape="audio" label="L" spec="S" />);
    expect(container.querySelector("figure")!.className).toMatch(/audio/);
  });

  it("appends a user-provided className without dropping the shape class", () => {
    const { container } = render(
      <Placeholder shape="portrait" label="L" spec="S" className="callout" />,
    );
    const className = container.querySelector("figure")!.className;
    expect(className).toMatch(/callout/);
    expect(className).toMatch(/portrait/);
  });

  it("renders cleanly when no className is passed", () => {
    // Defensive: undefined className should not stringify into the class list (no literal "undefined" suffix).
    const { container } = render(<Placeholder shape="square" label="L" spec="S" />);
    expect(container.querySelector("figure")!.className).not.toMatch(/undefined/);
  });
});
