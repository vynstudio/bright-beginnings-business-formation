// Server-side source of truth for what can be bought and what it costs.
// Keep in sync with src/lib/catalog.ts (display only).
export type Plan = "starter" | "professional" | "international";
export type Entity = "llc" | "corp";
export type Extra = "ein" | "annual_report" | "registered_agent" | "expedited";

export const PLAN_PRICES: Record<Plan, { priceId: string; cents: number }> = {
  starter: { priceId: "plan_starter_onetime", cents: 14900 },
  professional: { priceId: "plan_professional_onetime", cents: 24900 },
  international: { priceId: "plan_international_onetime", cents: 44900 },
};
export const STATE_FEE: Record<Entity, { priceId: string; cents: number }> = {
  llc: { priceId: "fl_state_fee_llc_onetime", cents: 12500 },
  corp: { priceId: "fl_state_fee_corp_onetime", cents: 7000 },
};
export const EXTRA_PRICES: Record<Extra, { priceId: string; cents: number }> = {
  ein: { priceId: "extra_ein_onetime", cents: 9900 },
  annual_report: { priceId: "extra_annual_report_onetime", cents: 11900 },
  registered_agent: { priceId: "extra_registered_agent_onetime", cents: 11900 },
  expedited: { priceId: "extra_expedited_onetime", cents: 6900 },
};
export const ANNUAL_REPORT_FEE: Record<Entity, { priceId: string; cents: number }> = {
  llc: { priceId: "fl_annual_report_fee_llc_onetime", cents: 13875 },
  corp: { priceId: "fl_annual_report_fee_corp_onetime", cents: 15000 },
};
// Extras already included in a plan can't be bought again.
export const INCLUDED: Record<Plan, Extra[]> = {
  starter: ["registered_agent"],
  professional: ["registered_agent", "ein", "expedited"],
  international: ["registered_agent", "ein", "expedited"],
};

export function buildLineItems(plan: Plan, entity: Entity, extras: Extra[]) {
  const chosen = [...new Set(extras)].filter((e) => !INCLUDED[plan].includes(e));
  const items = [PLAN_PRICES[plan], STATE_FEE[entity]];
  for (const e of chosen) {
    items.push(EXTRA_PRICES[e]);
    if (e === "annual_report") items.push(ANNUAL_REPORT_FEE[entity]);
  }
  return { items, extras: chosen, totalCents: items.reduce((s, i) => s + i.cents, 0) };
}
