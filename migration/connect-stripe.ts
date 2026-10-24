// Connects one Stripe mode (test or live) to the Supabase backend in a single run:
//   1. creates the checkout prices (create-stripe-prices.ts; skips ones that exist)
//   2. creates the payments-webhook endpoint in Stripe (replacing an old one with the same URL)
//   3. saves the Stripe secret key and the webhook signing secret as Supabase function secrets
// Secrets are never printed. Requires a prior `npx supabase login`.
//
//   node migration/connect-stripe.ts    (asks for the key with hidden input)
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { Writable } from "node:stream";

const PROJECT_REF = "ofitimdebbncfdhvxwub";
const SUPABASE_CLI = "supabase@2.120.0";
const EVENTS = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
];

async function askHidden(question: string): Promise<string> {
  process.stdout.write(question);
  const muted = new Writable({ write: (_chunk, _enc, done) => done() });
  const rl = createInterface({ input: process.stdin, output: muted, terminal: true });
  const answer = await new Promise<string>((resolve) => rl.question("", resolve));
  rl.close();
  process.stdout.write("\n");
  return answer.trim();
}

const key = process.env.STRIPE_SECRET_KEY || (await askHidden("Paste your Stripe secret key (hidden) and press Enter: "));
if (!/^sk_(test|live)_/.test(key)) {
  console.error("That doesn't look like a Stripe secret key (sk_test_... or sk_live_...).");
  process.exit(1);
}
const env = key.startsWith("sk_live_") ? "live" : "sandbox";
const ENV = env.toUpperCase();
console.log(`Stripe mode: ${env === "live" ? "LIVE" : "test (sandbox)"}\n`);

async function stripe(method: string, path: string, params?: Record<string, string>) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: params ? new URLSearchParams(params) : undefined,
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${path}: ${body.error?.message ?? res.status}`);
  return body;
}

console.log("1/3 Prices");
execFileSync(process.execPath, [join(import.meta.dirname, "create-stripe-prices.ts")], {
  stdio: "inherit",
  env: { ...process.env, STRIPE_SECRET_KEY: key },
});

console.log("\n2/3 Webhook");
const url = `https://${PROJECT_REF}.supabase.co/functions/v1/payments-webhook?env=${env}`;
const existing = await stripe("GET", "webhook_endpoints?limit=100");
for (const endpoint of existing.data) {
  if (endpoint.url === url) {
    await stripe("DELETE", `webhook_endpoints/${endpoint.id}`);
    console.log(`removed old endpoint ${endpoint.id}`);
  }
}
const params: Record<string, string> = { url, description: "Agente Registrado Florida orders (Supabase)" };
EVENTS.forEach((event, i) => (params[`enabled_events[${i}]`] = event));
const endpoint = await stripe("POST", "webhook_endpoints", params);
console.log(`created  ${endpoint.id} → ${url}`);

console.log("\n3/3 Supabase secrets");
const dir = mkdtempSync(join(tmpdir(), "stripe-secrets-"));
const envFile = join(dir, "secrets.env");
try {
  writeFileSync(envFile, `STRIPE_${ENV}_API_KEY=${key}\nPAYMENTS_${ENV}_WEBHOOK_SECRET=${endpoint.secret}\n`, { mode: 0o600 });
  execFileSync("npx", ["--yes", SUPABASE_CLI, "secrets", "set", "--env-file", envFile, "--project-ref", PROJECT_REF], {
    stdio: ["ignore", "ignore", "inherit"],
  });
} finally {
  rmSync(dir, { recursive: true, force: true });
}
console.log(`saved    STRIPE_${ENV}_API_KEY, PAYMENTS_${ENV}_WEBHOOK_SECRET`);
console.log("\nDone. You can close this tab.");
