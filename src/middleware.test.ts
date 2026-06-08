import { describe, expect, test } from "vitest";
import { config } from "./middleware";

describe("clerkMiddleware matcher", () => {
  const [pageMatcher, apiMatcher] = config.matcher;
  const pageRe = new RegExp(`^${pageMatcher}$`);
  const apiRe = new RegExp(`^${apiMatcher}$`);

  test.each([
    ["/", true],
    ["/signup", true],
    ["/success", true],
    ["/waitlist", true],
  ])("page route %s → middleware runs (%s)", (path, expected) => {
    expect(pageRe.test(path)).toBe(expected);
  });

  test.each([
    ["/_next/static/chunks/main.js", false],
    ["/favicon.ico", false],
    ["/og.png", false],
    ["/sitemap.xml", true],
    ["/foo.html", false],
    ["/foo.css", false],
    ["/foo.webp", false],
  ])("static asset %s should be %s", (path, runMiddleware) => {
    expect(pageRe.test(path)).toBe(runMiddleware);
  });

  test.each([
    ["/api/stripe/webhook", true],
    ["/api/plan-limits", true],
    ["/trpc/foo", true],
  ])("API/trpc route %s matches the API matcher", (path) => {
    expect(apiRe.test(path)).toBe(true);
  });
});
