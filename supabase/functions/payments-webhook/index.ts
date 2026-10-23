import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

let _db: ReturnType<typeof createClient> | null = null;
const db = () => (_db ??= createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!));

async function setStatus(session: any, env: StripeEnv, status: string) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;
  await db().from("orders")
    .update({ status, ...(status === "paid" && { paid_at: new Date().toISOString() }) })
    .eq("id", orderId).eq("environment", env);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    return new Response(JSON.stringify({ received: true, ignored: "invalid env" }), { status: 200 });
  }
  const env: StripeEnv = rawEnv;
  try {
    const event = await verifyWebhook(req, env);
    const s = event.data.object;
    switch (event.type) {
      case "checkout.session.completed":
        await setStatus(s, env, s.payment_status === "unpaid" ? "processing" : "paid");
        break;
      case "checkout.session.async_payment_succeeded":
        await setStatus(s, env, "paid");
        break;
      case "checkout.session.async_payment_failed":
        await setStatus(s, env, "failed");
        break;
      case "checkout.session.expired":
        await setStatus(s, env, "abandoned");
        break;
      default:
        console.log("Unhandled event:", event.type);
    }
    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});
