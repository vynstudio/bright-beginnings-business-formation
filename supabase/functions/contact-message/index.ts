import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { alertText, sendTelegram } from "../_shared/telegram.ts";

// Saves a contact-form message (only admins can read them) and alerts the owner on Telegram.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const noMarkup = (s: string) => !/[<>\u0000-\u001f]/.test(s);
const schema = z.object({
  name: z.string().trim().min(1).max(100).refine(noMarkup),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(200).refine(noMarkup),
  message: z.string().trim().min(10).max(2000),
  language: z.enum(["en", "es", "pt"]).default("es"),
  // Hidden field people never see; bots that fill it are ignored.
  website: z.string().max(0).optional(),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Please check the form and try again." }, 400);
    const { name, email, subject, message, language } = parsed.data;

    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { error } = await db.from("contact_messages").insert({ name, email, subject, message });
    if (error) throw error;

    await sendTelegram(alertText("✉️ New contact message", [
      ["Name", name],
      ["Email", email],
      ["Language", language.toUpperCase()],
      ["Subject", subject],
      ["Message", message.length > 1500 ? `${message.slice(0, 1500)}…` : message],
    ]));
    return json({ ok: true });
  } catch (e) {
    console.error("contact-message error", e);
    return json({ error: "Could not send your message." }, 500);
  }
});
