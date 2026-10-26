// Sends alerts (new clients, leads, contact messages) to the owner's Telegram chat.
// Secrets TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set by migration/connect-telegram.ts.
// Alerts never block the caller: if Telegram fails, the error is only logged.

const escape = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Builds an HTML message: a bold title, then "label: value" lines (empty values are skipped).
export const alertText = (title: string, lines: [string, unknown][]) =>
  [`<b>${escape(title)}</b>`, ...lines.filter(([, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) => `${escape(k)}: ${escape(v)}`)].join("\n");

export async function sendTelegram(text: string) {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    if (!res.ok) console.error("Telegram alert failed", res.status, await res.text());
  } catch (e) {
    console.error("Telegram alert failed", e);
  }
}

export const ADMIN_ORDERS_URL = "https://agenteregistradofl.com/admin/orders";
export const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
