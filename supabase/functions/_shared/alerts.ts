// Sends owner alerts (new clients, leads, contact messages) to Telegram and by email.
// Telegram: secrets TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID (migration/connect-telegram.ts).
// Email: secret ALERT_SECRET, shared with the site's Cloudflare worker, which sends the email
// (worker/alert-email.js). Alerts never block the caller: failures are only logged.

const escape = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type Lines = [string, unknown][];
const present = (lines: Lines) => lines.filter(([, v]) => v !== undefined && v !== null && v !== "");

async function telegram(title: string, lines: Lines) {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return;
  const text = [`<b>${escape(title)}</b>`, ...present(lines).map(([k, v]) => `${escape(k)}: ${escape(v)}`)].join("\n");
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${await res.text()}`);
}

async function email(title: string, lines: Lines) {
  const secret = Deno.env.get("ALERT_SECRET");
  if (!secret) return;
  const text = present(lines).map(([k, v]) => `${k}: ${v}`).join("\n");
  const res = await fetch("https://agenteregistradofl.com/api/alert-email", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-alert-secret": secret },
    // The first value (company or person) makes each subject unique, so Gmail doesn't thread alerts together.
    body: JSON.stringify({ subject: `${title}: ${present(lines)[0]?.[1] ?? ""}`.slice(0, 200), text }),
  });
  if (!res.ok) throw new Error(`Alert email ${res.status}: ${await res.text()}`);
}

// A bold title, then "label: value" lines (empty values are skipped).
export async function sendAlert(title: string, lines: Lines) {
  const results = await Promise.allSettled([telegram(title, lines), email(title, lines)]);
  for (const r of results) if (r.status === "rejected") console.error("Alert failed", r.reason);
}

export const ADMIN_ORDERS_URL = "https://agenteregistradofl.com/admin/orders";
export const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
