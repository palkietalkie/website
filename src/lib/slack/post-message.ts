// Post a message to a Slack channel via chat.postMessage. Skips silently when the bot token or channel id is unset, so dev environments without Slack wired don't error the caller. Slack outages are best-effort: logged, never thrown.

const CHAT_POST_MESSAGE_URL = "https://slack.com/api/chat.postMessage";

export async function postMessage(channel: string, text: string): Promise<void> {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token || !channel) return;
  try {
    const res = await fetch(CHAT_POST_MESSAGE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel, text }),
    });
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!body.ok) {
      console.error("[slack] chat.postMessage rejected", body.error ?? "unknown");
    }
  } catch (e) {
    console.error("[slack] chat.postMessage failed", e);
  }
}
