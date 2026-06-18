import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Screenshot } from "@/components/Screenshot";

describe("Screenshot", () => {
  it("renders an img with the given src and alt", () => {
    render(<Screenshot src="/screens/01-talk.png" alt="Talk screen" />);
    const img = screen.getByRole("img", { name: "Talk screen" });
    // next/image rewrites src to its optimizer URL (/_next/image?url=...), so assert the source path is referenced rather than matching verbatim.
    expect(img.getAttribute("src")).toContain("01-talk");
  });

  it("lazy-loads so below-the-fold screenshots don't block first paint", () => {
    render(<Screenshot src="/screens/02-persona.png" alt="Persona picker" />);
    expect(screen.getByRole("img", { name: "Persona picker" })).toHaveAttribute("loading", "lazy");
  });
});
