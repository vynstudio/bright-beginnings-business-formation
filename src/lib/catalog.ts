// Display copy for plans and extras. Prices charged are decided server-side
// (supabase/functions/_shared/catalog.ts) — keep amounts in sync.
export type Plan = "starter" | "professional" | "international";
export type Entity = "llc" | "corp";
export type Extra = "ein" | "annual_report" | "registered_agent" | "expedited";

export const PLANS: { id: Plan; name: string; price: number; tagline: string; features: string[] }[] = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    tagline: "For simple new companies with basic needs.",
    features: [
      "Articles prepared and filed with Sunbiz",
      "Operating agreement (LLC) or bylaws (corporation)",
      "1 year of registered agent service",
      "Privacy: our address on public records",
      "Referrals to partner CPAs and attorneys",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 199,
    tagline: "For running your business with more compliance help.",
    features: [
      "Everything in Starter",
      "EIN (tax ID) from the IRS",
      "Expedited 24-hour filing",
      "Certificate of status",
      "Free amendment or name change in first 90 days",
    ],
  },
  {
    id: "international",
    name: "International+",
    price: 399,
    tagline: "For founders who live outside the US.",
    features: [
      "Everything in Professional",
      "EIN for non-US owners (no SSN needed)",
      "Apostille of formation documents",
      "Certificate of incumbency",
      "One free fictitious name (DBA)",
      "US business bank account guidance",
    ],
  },
];

export const STATE_FEE: Record<Entity, number> = { llc: 125, corp: 70 };
export const ANNUAL_REPORT_FEE: Record<Entity, number> = { llc: 138.75, corp: 150 };

export const EXTRAS: { id: Extra; name: string; price: number; note?: string }[] = [
  { id: "ein", name: "EIN (tax ID) application", price: 79 },
  { id: "annual_report", name: "Annual report filing", price: 99, note: "+ state fee" },
  { id: "registered_agent", name: "Registered agent service (1 year)", price: 99 },
  { id: "expedited", name: "Expedited same-day filing", price: 49 },
];

export const INCLUDED: Record<Plan, Extra[]> = {
  starter: ["registered_agent"],
  professional: ["registered_agent", "ein", "expedited"],
  international: ["registered_agent", "ein", "expedited"],
};

export function orderTotal(plan: Plan, entity: Entity, extras: Extra[]) {
  const p = PLANS.find((x) => x.id === plan)!;
  const lines: { label: string; amount: number }[] = [
    { label: `${p.name} package`, amount: p.price },
    { label: "Florida state filing fee", amount: STATE_FEE[entity] },
  ];
  for (const e of extras) {
    if (INCLUDED[plan].includes(e)) continue;
    const x = EXTRAS.find((y) => y.id === e)!;
    lines.push({ label: x.name, amount: x.price });
    if (e === "annual_report") lines.push({ label: "Florida annual report state fee", amount: ANNUAL_REPORT_FEE[entity] });
  }
  return { lines, total: Math.round(lines.reduce((s, l) => s + l.amount, 0) * 100) / 100 };
}

export const money = (n: number) => `$${n % 1 ? n.toFixed(2) : n}`;
