import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_TOKEN = process.env.SLACK_BOT_TOKEN;

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  if (ORIGINAL_TOKEN === undefined) delete process.env.SLACK_BOT_TOKEN;
  else process.env.SLACK_BOT_TOKEN = ORIGINAL_TOKEN;
  vi.restoreAllMocks();
});

describe("postMessage", () => {
  it("skips when SLACK_BOT_TOKEN is unset", async () => {
    delete process.env.SLACK_BOT_TOKEN;
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const { postMessage } = await import("@/lib/slack/post-message");
    await postMessage("Cxxx", "hi");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("skips when channel is empty", async () => {
    process.env.SLACK_BOT_TOKEN = "xoxb-test";
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const { postMessage } = await import("@/lib/slack/post-message");
    await postMessage("", "hi");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("posts to chat.postMessage with the bot token", async () => {
    process.env.SLACK_BOT_TOKEN = "xoxb-test";
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchSpy);
    const { postMessage } = await import("@/lib/slack/post-message");
    await postMessage("C0B8R2H1E8H", "hello");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(url).toBe("https://slack.com/api/chat.postMessage");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer xoxb-test");
    const body = JSON.parse(init.body);
    expect(body).toEqual({ channel: "C0B8R2H1E8H", text: "hello" });
  });

  it("logs (does not throw) when Slack returns ok=false", async () => {
    process.env.SLACK_BOT_TOKEN = "xoxb-test";
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: false, error: "channel_not_found" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchSpy);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { postMessage } = await import("@/lib/slack/post-message");
    await postMessage("CBAD", "hi");
    expect(consoleSpy).toHaveBeenCalledWith(
      "[slack] chat.postMessage rejected",
      "channel_not_found",
    );
  });

  it("logs (does not throw) when fetch rejects", async () => {
    process.env.SLACK_BOT_TOKEN = "xoxb-test";
    const fetchSpy = vi.fn().mockRejectedValue(new Error("boom"));
    vi.stubGlobal("fetch", fetchSpy);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { postMessage } = await import("@/lib/slack/post-message");
    await postMessage("Cxxx", "hi");
    expect(consoleSpy).toHaveBeenCalled();
  });
});
