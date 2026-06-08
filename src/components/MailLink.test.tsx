import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MailLink } from "@/components/MailLink";
import { SUPPORT_EMAIL } from "@/constants/support-email";

describe("MailLink", () => {
  it("defaults the visible text to the support email address", () => {
    render(<MailLink />);
    expect(screen.getByText(SUPPORT_EMAIL)).toBeInTheDocument();
  });

  it("uses mailto:<SUPPORT_EMAIL> as the href by default", () => {
    const { getByRole } = render(<MailLink />);
    expect(getByRole("link")).toHaveAttribute("href", `mailto:${SUPPORT_EMAIL}`);
  });

  it("renders custom children verbatim when provided", () => {
    render(<MailLink>Contact support</MailLink>);
    expect(screen.getByRole("link")).toHaveTextContent("Contact support");
    expect(screen.queryByText(SUPPORT_EMAIL)).not.toBeInTheDocument();
  });

  it("URL-encodes the subject parameter", () => {
    // Raw spaces in mailto subjects break Outlook on Windows. Encoding is the only safe form.
    render(<MailLink subject="Hello, world!" />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Hello, world!")}`,
    );
  });

  it("adds target=_blank and rel=noopener noreferrer when newWindow is true", () => {
    render(<MailLink newWindow />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(link.getAttribute("rel")).toContain("noreferrer");
  });

  it("omits target/rel when newWindow is unset (default OS hand-off)", () => {
    render(<MailLink />);
    const link = screen.getByRole("link");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });

  it("forwards the className prop to the anchor", () => {
    render(<MailLink className="custom-class" />);
    expect(screen.getByRole("link")).toHaveClass("custom-class");
  });
});
