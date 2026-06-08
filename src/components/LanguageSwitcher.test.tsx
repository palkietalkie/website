import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { COOKIE_NAME, LANGUAGE_NAMES } from "@/i18n/config";
import { renderWithI18n } from "@/test/render-with-i18n";

const refreshMock = vi.fn();

// Override the router stub from vitest.setup.ts so we can inspect refresh() calls.
vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      refresh: refreshMock,
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    }),
  };
});

afterEach(() => {
  refreshMock.mockReset();
  document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0`;
});

describe("LanguageSwitcher", () => {
  it("renders a globe trigger button", () => {
    renderWithI18n(<LanguageSwitcher />);
    const trigger = screen.getByRole("button", { name: /language/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger.getAttribute("aria-haspopup")).toBe("listbox");
  });

  it("opens and lists every supported language in native script", async () => {
    const user = userEvent.setup();
    renderWithI18n(<LanguageSwitcher />);
    await user.click(screen.getByRole("button", { name: /language/i }));
    for (const native of Object.values(LANGUAGE_NAMES)) {
      expect(screen.getByRole("option", { name: native })).toBeInTheDocument();
    }
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    renderWithI18n(<LanguageSwitcher />);
    await user.click(screen.getByRole("button", { name: /language/i }));
    expect(screen.queryByRole("listbox")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  });

  it("closes on overlay click", async () => {
    const user = userEvent.setup();
    renderWithI18n(<LanguageSwitcher />);
    await user.click(screen.getByRole("button", { name: /language/i }));
    await user.click(screen.getByRole("button", { name: /close/i }));
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  });

  it("writes the cookie + calls router.refresh when a non-current language is picked", async () => {
    const user = userEvent.setup();
    renderWithI18n(<LanguageSwitcher />);
    await user.click(screen.getByRole("button", { name: /language/i }));
    await user.click(screen.getByRole("option", { name: LANGUAGE_NAMES.ja }));
    expect(document.cookie).toContain(`${COOKIE_NAME}=ja`);
    await waitFor(() => expect(refreshMock).toHaveBeenCalledTimes(1));
  });

  it("is a no-op when the same language is picked", async () => {
    const user = userEvent.setup();
    renderWithI18n(<LanguageSwitcher />);
    await user.click(screen.getByRole("button", { name: /language/i }));
    // English is the default locale in tests.
    await user.click(screen.getByRole("option", { name: LANGUAGE_NAMES.en }));
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it("toggles the trigger via repeat clicks", async () => {
    const user = userEvent.setup();
    renderWithI18n(<LanguageSwitcher />);
    const trigger = screen.getByRole("button", { name: /language/i });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
