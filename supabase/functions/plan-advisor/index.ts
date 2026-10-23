import { createOpenAI } from "npm:@ai-sdk/openai@3";
import { streamText, Output } from "npm:ai@6";
import { z } from "npm:zod@3";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-lovable-aig-run-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const input = z.object({
  description: z.string().trim().min(20).max(2000),
  language: z.enum(["en", "es", "pt"]).default("en"),
});

const recommendation = z.object({
  entityType: z.enum(["llc", "corp"]),
  plan: z.enum(["starter", "professional", "international"]),
  extras: z.array(z.enum(["ein", "annual_report", "registered_agent", "expedited"])),
  summary: z.string(),
  reasons: z.array(z.string()),
  talkToProfessional: z.array(z.string()),
});

const LANG = { en: "English", es: "Spanish", pt: "Brazilian Portuguese" } as const;

const instructions = (lang: keyof typeof LANG) => `You help visitors of "Agente Registrado Florida", a Florida business formation service, pick a company type and package.
You are NOT a lawyer or accountant and must not give legal or tax advice. Give general, educational guidance only.

Company types:
- llc: Florida LLC. Simple, flexible, good for most small businesses, freelancers, e-commerce, real estate holding, single owners. Florida state fee $125.
- corp: Florida corporation. Better when the owner plans to raise outside investment, issue shares, or wants a classic corporate structure. Florida state fee $70.

Packages (one-time):
- starter ($99): articles filed, operating agreement or bylaws, 1 year registered agent, privacy address. For US residents who already have or don't need an EIN.
- professional ($199): starter + EIN, expedited 24h filing, certificate of status, free amendment in 90 days. For most US-based founders.
- international ($399): professional + EIN for non-US owners without SSN, apostille, certificate of incumbency, one free DBA, bank account guidance. For owners living outside the US.

Optional extras (only suggest if clearly useful and not included in the plan): ein (starter only), annual_report (prepay first annual report), registered_agent (already included in all plans, normally don't suggest), expedited (starter only).

Rules:
- If the owner lives outside the US, recommend international.
- Write summary (1-2 sentences), reasons (2-4 short bullets) and talkToProfessional (1-3 short bullets on questions they should ask a CPA or attorney, e.g. taxes, S-corp election, licenses) in ${LANG[lang]}.
- Never promise tax savings or legal outcomes.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const parsed = input.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "Please describe your business in a few sentences." }, 400);
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json({ error: "The advisor is not configured." }, 500);

  try {
    const runId = req.headers.get("X-Lovable-AIG-Run-ID")?.trim() || undefined;
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: {
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
        ...(runId ? { "X-Lovable-AIG-Run-ID": runId } : {}),
      },
    });
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      system: instructions(parsed.data.language),
      messages: [{ role: "user", content: parsed.data.description }],
      output: Output.object({ schema: recommendation }),
      abortSignal: req.signal,
      providerOptions: {
        openai: {
          store: false,
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    const output = await result.output;
    return json({ recommendation: output });
  } catch (e) {
    const status = (e as any)?.statusCode ?? (e as any)?.status;
    console.error("plan-advisor error", status, (e as Error).message);
    if (status === 429) return json({ error: "The advisor is busy. Please try again in a minute." }, 429);
    if (status === 402) return json({ error: "The advisor is temporarily unavailable." }, 402);
    return json({ error: "The advisor could not answer right now. Please try again." }, 500);
  }
});
