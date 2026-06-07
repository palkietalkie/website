import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// `useRouter` from `next/navigation` throws "invariant expected app router to be mounted" outside an App Router runtime. Components that use it (LanguageSwitcher's router.refresh()) need a stub to render in vitest.
vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    }),
  };
});

// AppStoreButton is an async server component that reads next/headers + env to decide between an App Store deep-link and the waitlist CTA. Async server components do not resolve inside testing-library's synchronous render(), so we substitute a tiny client stub that exposes the same surface (an <a> with the App Store URL + label "Download on the App Store"). Behavior tests for the launch-state branching live next to the source files in src/lib.
vi.mock("@/components/AppStoreButton", () => ({
  AppStoreButton: () =>
    React.createElement(
      "a",
      {
        href: "https://apps.apple.com/app/palkie-talkie/id000000000",
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": "Download on the App Store",
      },
      "Download on the App Store",
    ),
}));

// shouldShowWaitlist reads next/headers + env — same async server-only constraint as AppStoreButton. Tests default it to false (launched mode) so post-launch UI like the Subscribe nav link stays rendered and assertable. Per-state behavior is covered by src/lib/should-show-waitlist.test.ts.
vi.mock("@/lib/should-show-waitlist", () => ({
  shouldShowWaitlist: async () => false,
}));

// next-intl's `getTranslations` from "/server" throws in a Client Component runtime — which jsdom looks like to next-intl. Tests for async server components (Home, PricingPage) need this to resolve. We mock it to return a translator that reads from the same `messages/en.json` bundle the client-side `useTranslations` uses, so assertions against `enMessages.foo.bar` match.
vi.mock("next-intl/server", async () => {
  const en = (await import("./messages/en.json")).default;
  function get(path: string): unknown {
    return path.split(".").reduce<unknown>((acc, k) => {
      if (acc && typeof acc === "object" && k in acc) {
        return (acc as Record<string, unknown>)[k];
      }
      return undefined;
    }, en);
  }
  type Translator = ((key: string, values?: Record<string, string | number>) => string) & {
    raw: (key: string) => unknown;
  };
  function makeTranslator(namespace?: string): Translator {
    const t = ((key: string, values?: Record<string, string | number>) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const value = get(fullKey);
      let s = typeof value === "string" ? value : fullKey;
      if (values) {
        for (const [k, v] of Object.entries(values)) {
          s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return s;
    }) as Translator;
    t.raw = (key: string) => get(namespace ? `${namespace}.${key}` : key);
    return t;
  }
  return {
    getTranslations: async (namespace?: string) => makeTranslator(namespace),
    getLocale: async () => "en",
    getMessages: async () => en,
  };
});
