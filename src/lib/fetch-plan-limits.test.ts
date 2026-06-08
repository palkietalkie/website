import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchPlanLimits } from "./fetch-plan-limits";

const FALLBACK = { freeMinutesPerDay: 10, freeMinutesPerWeek: 30 };

describe("fetchPlanLimits", () => {
  const originalFetch = globalThis.fetch;
  const originalBackend = process.env.NEXT_PUBLIC_BACKEND_URL;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_BACKEND_URL;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    if (originalBackend === undefined) delete process.env.NEXT_PUBLIC_BACKEND_URL;
    else process.env.NEXT_PUBLIC_BACKEND_URL = originalBackend;
    vi.restoreAllMocks();
  });

  it("returns the backend's numbers on a 200 response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ free_minutes_per_day: 12, free_minutes_per_week: 45 }),
    } as Response);
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    await expect(fetchPlanLimits()).resolves.toEqual({
      freeMinutesPerDay: 12,
      freeMinutesPerWeek: 45,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("hits the default dev backend host when NEXT_PUBLIC_BACKEND_URL is unset", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ free_minutes_per_day: 10, free_minutes_per_week: 30 }),
    } as Response);
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    await fetchPlanLimits();
    expect(fetchMock.mock.calls[0]![0]).toBe("https://palkietalkie-api-dev.fly.dev/plan_limits");
  });

  it("honors NEXT_PUBLIC_BACKEND_URL when set", async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = "https://prd-api.example.com";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ free_minutes_per_day: 8, free_minutes_per_week: 20 }),
    } as Response);
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    await fetchPlanLimits();
    expect(fetchMock.mock.calls[0]![0]).toBe("https://prd-api.example.com/plan_limits");
  });

  it("passes Next's 5-minute ISR revalidate hint", async () => {
    // Marketing copy doesn't need real-time freshness; we lock the cache window in the code path to avoid hammering the backend on every render.
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ free_minutes_per_day: 10, free_minutes_per_week: 30 }),
    } as Response);
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    await fetchPlanLimits();
    expect(fetchMock.mock.calls[0]![1]).toEqual({ next: { revalidate: 300 } });
  });

  it("falls back when the backend returns non-2xx", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response) as unknown as typeof fetch;
    await expect(fetchPlanLimits()).resolves.toEqual(FALLBACK);
  });

  it("falls back when fetch throws (backend unreachable)", async () => {
    globalThis.fetch = vi
      .fn()
      .mockRejectedValue(new Error("network down")) as unknown as typeof fetch;
    await expect(fetchPlanLimits()).resolves.toEqual(FALLBACK);
  });
});
