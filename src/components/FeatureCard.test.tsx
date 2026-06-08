import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeatureCard } from "@/components/FeatureCard";

describe("FeatureCard", () => {
  it("zero-pads single-digit feature numbers", () => {
    render(<FeatureCard n={3} title="Real personas" body="Persona system" />);
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("renders the title at heading level 3", () => {
    render(<FeatureCard n={1} title="Mic-first" body="Main screen is the mic." />);
    expect(screen.getByRole("heading", { level: 3, name: "Mic-first" })).toBeInTheDocument();
  });

  it("renders the body text", () => {
    render(<FeatureCard n={1} title="Mic-first" body="Main screen is the mic." />);
    expect(screen.getByText("Main screen is the mic.")).toBeInTheDocument();
  });

  it("does not pad numbers that are already two digits", () => {
    render(<FeatureCard n={12} title="x" body="y" />);
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});
