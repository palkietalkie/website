import type { ReactNode } from "react";
import { SUPPORT_EMAIL } from "@/constants/support-email";

type Props = {
  /** Link text. Defaults to the email address itself, matching the most common inline-prose pattern ("Email <hello@palkietalkie.com> for ..."). */
  children?: ReactNode;
  className?: string;
  /** Add target="_blank" + rel="noopener noreferrer". Mailto: links normally hand off to the OS mail client; the new-window pair only matters when the visitor's default mail handler is a webmail tab. */
  newWindow?: boolean;
  /** Optional pre-filled subject line. Pass plain text; URL-encoding is handled here. */
  subject?: string;
};

export function MailLink({ children, className, newWindow, subject }: Props) {
  const href = subject
    ? `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`
    : `mailto:${SUPPORT_EMAIL}`;
  return (
    <a
      href={href}
      className={className}
      target={newWindow ? "_blank" : undefined}
      rel={newWindow ? "noopener noreferrer" : undefined}
    >
      {children ?? SUPPORT_EMAIL}
    </a>
  );
}
