// Connects the owner's Telegram bot to the site's alerts in one run:
//   1. asks for the bot token (hidden) and checks it with Telegram
//   2. finds your chat: send any message to your bot first (or add it to a group and write there)
//   3. sends a test alert and saves TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID as Supabase function secrets
// The token is never printed. Requires a prior `npx supabase login`.
//
//   node migration/connect-telegram.ts
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { Writable } from "node:stream";

const PROJECT_REF = "ofitimdebbncfdhvxwub";
const SUPABASE_CLI = "supabase@2.120.0";

async function ask(question: string, hidden = false): Promise<string> {
  process.stdout.write(question);
  const output = hidden ? new Writable({ write: (_chunk, _enc, done) => done() }) : process.stdout;
  const rl = createInterface({ input: process.stdin, output, terminal: true });
  const answer = await new Promise<string>((resolve) => rl.question("", resolve));
  rl.close();
  if (hidden) process.stdout.write("\n");
  return answer.trim();
}

const token = await ask("Paste your Telegram bot token from BotFather (hidden) and press Enter: ", true);
if (!/^\d+:[\w-]{30,}$/.test(token)) {
  console.error("That doesn't look like a bot token (it looks like 123456789:AA...).");
  process.exit(1);
}

const tg = async (method: string, body?: unknown) => {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`${method}: ${data.description}`);
  return data.result;
};

const bot = await tg("getMe");
console.log(`Bot: ${bot.first_name} (@${bot.username})`);

type Chat = { id: number; title?: string; first_name?: string; type: string };
const findChats = async (): Promise<Chat[]> => {
  const updates = await tg("getUpdates", { limit: 100 });
  const chats = new Map<number, Chat>();
  for (const u of updates) {
    const chat = (u.message ?? u.channel_post ?? u.my_chat_member)?.chat;
    if (chat) chats.set(chat.id, chat);
  }
  return [...chats.values()];
};

let chats = await findChats();
while (!chats.length) {
  await ask(`\nOpen Telegram, find @${bot.username}, press Start (or send "hola"), then press Enter here... `);
  chats = await findChats();
}
let chat = chats[chats.length - 1];
if (chats.length > 1) {
  chats.forEach((c, i) => console.log(`  ${i + 1}. ${c.title ?? c.first_name} (${c.type})`));
  const pick = Number(await ask("Which chat should get the alerts? Type its number: "));
  chat = chats[pick - 1] ?? chat;
}
console.log(`Alerts will go to: ${chat.title ?? chat.first_name} (${chat.type})`);

await tg("sendMessage", {
  chat_id: chat.id,
  text: "✅ Agente Registrado Florida: alerts connected. You'll get new clients, leads and contact messages here.",
});

const dir = mkdtempSync(join(tmpdir(), "telegram-secrets-"));
const envFile = join(dir, "secrets.env");
try {
  writeFileSync(envFile, `TELEGRAM_BOT_TOKEN=${token}\nTELEGRAM_CHAT_ID=${chat.id}\n`, { mode: 0o600 });
  execFileSync("npx", ["--yes", SUPABASE_CLI, "secrets", "set", "--env-file", envFile, "--project-ref", PROJECT_REF], {
    stdio: ["ignore", "ignore", "inherit"],
  });
} finally {
  rmSync(dir, { recursive: true, force: true });
}
console.log("saved    TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID\n\nDone. Check Telegram for the test message.");
