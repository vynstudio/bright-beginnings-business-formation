// Creates the products and prices that create-checkout looks up by lookup_key,
// using the amounts in supabase/functions/_shared/catalog.ts (the source of truth).
// Safe to run more than once: prices that already exist are skipped.
//
// Run once per Stripe mode, with the key typed into your own terminal:
//   STRIPE_SECRET_KEY=sk_test_... node migration/create-stripe-prices.ts
//   STRIPE_SECRET_KEY=sk_live_... node migration/create-stripe-prices.ts
import {
  ANNUAL_REPORT_FEE,
  EXTRA_PRICES,
  PLAN_PRICES,
  STATE_FEE,
} from "../supabase/functions/_shared/catalog.ts";

const key = process.env.STRIPE_SECRET_KEY;
if (!key || !/^(sk|rk)_(test|live)_/.test(key)) {
  console.error("Set STRIPE_SECRET_KEY to your Stripe secret or restricted key (sk_/rk_ test or live).");
  process.exit(1);
}

const names: Record<string, string> = {
  [PLAN_PRICES.starter.priceId]: "Starter package",
  [PLAN_PRICES.professional.priceId]: "Professional package",
  [PLAN_PRICES.international.priceId]: "International+ package",
  [PLAN_PRICES.business_website.priceId]: "Business + Website package",
  [STATE_FEE.llc.priceId]: "Florida state filing fee (LLC)",
  [STATE_FEE.corp.priceId]: "Florida state filing fee (corporation)",
  [EXTRA_PRICES.ein.priceId]: "EIN application",
  [EXTRA_PRICES.annual_report.priceId]: "Annual report filing",
  [EXTRA_PRICES.registered_agent.priceId]: "Registered agent (1 year)",
  [EXTRA_PRICES.expedited.priceId]: "Expedited filing",
  [ANNUAL_REPORT_FEE.llc.priceId]: "Florida annual report state fee (LLC)",
  [ANNUAL_REPORT_FEE.corp.priceId]: "Florida annual report state fee (corporation)",
};

const prices = [
  ...Object.values(PLAN_PRICES),
  ...Object.values(STATE_FEE),
  ...Object.values(EXTRA_PRICES),
  ...Object.values(ANNUAL_REPORT_FEE),
];

async function stripe(path: string, params?: Record<string, string>) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: params ? "POST" : "GET",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: params ? new URLSearchParams(params) : undefined,
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${path}: ${body.error?.message ?? res.status}`);
  return body;
}

console.log(`Stripe mode: ${/^(sk|rk)_live_/.test(key) ? "LIVE" : "test"}`);
for (const { priceId, cents } of prices) {
  const existing = await stripe(`prices?lookup_keys[]=${priceId}&limit=1`);
  const found = existing.data[0];
  if (found && found.unit_amount === cents) {
    console.log(`exists   ${priceId}`);
    continue;
  }
  if (found) {
    // Stripe prices can't change amount: add a new price on the same product, move the
    // lookup key to it (checkout finds prices by lookup key) and archive the old one.
    await stripe("prices", {
      product: found.product,
      currency: "usd",
      unit_amount: String(cents),
      lookup_key: priceId,
      transfer_lookup_key: "true",
      tax_behavior: "exclusive",
    });
    await stripe(`prices/${found.id}`, { active: "false" });
    console.log(`updated  ${priceId}  $${(found.unit_amount / 100).toFixed(2)} → $${(cents / 100).toFixed(2)}`);
    continue;
  }
  const product = await stripe("products", { name: names[priceId] });
  await stripe("prices", {
    product: product.id,
    currency: "usd",
    unit_amount: String(cents),
    lookup_key: priceId,
    tax_behavior: "exclusive",
  });
  console.log(`created  ${priceId}  $${(cents / 100).toFixed(2)}  ${names[priceId]}`);
}
