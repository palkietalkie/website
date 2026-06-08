import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const cookiesMock = vi.fn();
const hashVisitorIpMock = vi.fn().mockResolvedValue("ffffffffffffffffffffffffffffffff");
const sqlMock = vi.fn().mockResolvedValue([]);
const getSqlMock = vi.fn(() => sqlMock);
const postMessageMock = vi.fn().mockResolvedValue(undefined);

vi.mock("next/headers", () => ({ cookies: () => cookiesMock() }));
vi.mock("@/lib/hash-visitor-ip", () => ({ hashVisitorIp: () => hashVisitorIpMock() }));
vi.mock("@/lib/neon/get-sql", () => ({ getSql: () => getSqlMock() }));
vi.mock("@/lib/slack/post-message", () => ({
  postMessage: (channel: string, text: string) => postMessageMock(channel, text),
}));

const { submitWaitlist } = await import("./submit-waitlist");

function fd(entries: Array<[string, string]>): FormData {
  const f = new FormData();
  for (const [k, v] of entries) f.append(k, v);
  return f;
}

const validFields: Array<[string, string]> = [
  ["email", "wes@example.com"],
  ["name", "Wes"],
  ["phone", "iphone-16-pro"],
  ["nativeLanguages", "ja"],
  ["targetLanguage", "en"],
];

beforeEach(() => {
  vi.clearAllMocks();
  cookiesMock.mockResolvedValue({ get: () => ({ value: "en" }) });
  hashVisitorIpMock.mockResolvedValue("ffffffffffffffffffffffffffffffff");
  getSqlMock.mockReturnValue(sqlMock);
  sqlMock.mockResolvedValue([]);
  postMessageMock.mockResolvedValue(undefined);
  process.env.NEON_DATABASE_URL = "postgres://test";
  process.env.SLACK_CHANNEL_GTM = "C123";
});

afterEach(() => {
  delete process.env.NEON_DATABASE_URL;
  delete process.env.SLACK_CHANNEL_GTM;
});

describe("submitWaitlist validation", () => {
  test("rejects empty email", async () => {
    const r = await submitWaitlist(fd([["email", ""]]));
    expect(r).toEqual({ ok: false, error: expect.stringMatching(/valid email/i) });
  });

  test("rejects malformed email", async () => {
    const r = await submitWaitlist(fd([["email", "not-an-email"]]));
    expect(r).toEqual({ ok: false, error: expect.stringMatching(/valid email/i) });
  });

  test("rejects missing name", async () => {
    const r = await submitWaitlist(fd([["email", "x@y.z"]]));
    expect(r).toEqual({ ok: false, error: expect.stringMatching(/first name/i) });
  });

  test("rejects missing device", async () => {
    const r = await submitWaitlist(
      fd([
        ["email", "x@y.z"],
        ["name", "Wes"],
      ]),
    );
    expect(r).toEqual({ ok: false, error: expect.stringMatching(/device/i) });
  });

  test("rejects empty nativeLanguages selection", async () => {
    const r = await submitWaitlist(
      fd([
        ["email", "x@y.z"],
        ["name", "Wes"],
        ["phone", "iphone-16"],
      ]),
    );
    expect(r).toEqual({ ok: false, error: expect.stringMatching(/native language/i) });
  });

  test("filters nativeLanguages to known LOCALES + 'other'", async () => {
    const r = await submitWaitlist(
      fd([
        ["email", "x@y.z"],
        ["name", "Wes"],
        ["phone", "iphone-16"],
        ["nativeLanguages", "garbage_locale"],
      ]),
    );
    // garbage filtered out → empty → same error as missing
    expect(r).toEqual({ ok: false, error: expect.stringMatching(/native language/i) });
  });

  test("rejects missing or unknown targetLanguage", async () => {
    const r = await submitWaitlist(
      fd([
        ["email", "x@y.z"],
        ["name", "Wes"],
        ["phone", "iphone-16"],
        ["nativeLanguages", "ja"],
      ]),
    );
    expect(r).toEqual({ ok: false, error: expect.stringMatching(/language you want to learn/i) });
  });
});

describe("submitWaitlist success paths", () => {
  test("inserts into Neon and posts to Slack when DB is wired", async () => {
    const r = await submitWaitlist(fd(validFields));
    expect(r).toEqual({ ok: true });
    expect(getSqlMock).toHaveBeenCalled();
    expect(sqlMock).toHaveBeenCalled();
    expect(postMessageMock).toHaveBeenCalledWith(
      "C123",
      expect.stringContaining("wes@example.com"),
    );
  });

  test("falls back to console log when NEON_DATABASE_URL is unset", async () => {
    delete process.env.NEON_DATABASE_URL;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const r = await submitWaitlist(fd(validFields));
    expect(r).toEqual({ ok: true });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("NEON_DATABASE_URL"));
    expect(log).toHaveBeenCalledWith("[waitlist:fallback]", expect.any(String));
    expect(getSqlMock).not.toHaveBeenCalled();
    warn.mockRestore();
    log.mockRestore();
  });

  test("returns failure when sql throws", async () => {
    sqlMock.mockRejectedValueOnce(new Error("connection refused"));
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await submitWaitlist(fd(validFields));
    expect(r).toEqual({ ok: false, error: expect.stringMatching(/wrong/i) });
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });

  test("trims and slices oversized values", async () => {
    const r = await submitWaitlist(
      fd([
        ["email", "  wes@example.com  "],
        ["name", "Wes"],
        ["phone", "iphone-16"],
        ["nativeLanguages", "ja"],
        ["targetLanguage", "en"],
        ["biggestPain", "x".repeat(3000)],
      ]),
    );
    expect(r).toEqual({ ok: true });
  });

  test("ignores non-string FormData values gracefully", async () => {
    const f = new FormData();
    f.append("email", "wes@example.com");
    f.append("name", "Wes");
    f.append("phone", "iphone-16");
    f.append("nativeLanguages", "ja");
    f.append("targetLanguage", "en");
    f.append("biggestPain", new File([], "blob"));
    const r = await submitWaitlist(f);
    expect(r).toEqual({ ok: true });
  });
});
