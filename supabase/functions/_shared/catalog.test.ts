import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { buildLineItems } from "./catalog.ts";

Deno.test("Starter LLC is $149 + $125 state fee", () => {
  assertEquals(buildLineItems("starter", "llc", []).totalCents, 27400);
});

Deno.test("International+ corporation is $449 + $70 state fee", () => {
  assertEquals(buildLineItems("international", "corp", []).totalCents, 51900);
});

Deno.test("Extras already included in the plan are not charged again", () => {
  assertEquals(buildLineItems("professional", "llc", ["ein", "expedited"]).totalCents, 37400);
});

Deno.test("Annual report adds $119 plus the Florida annual report fee", () => {
  assertEquals(buildLineItems("starter", "llc", ["annual_report"]).totalCents, 27400 + 11900 + 13875);
});

Deno.test("Starter extras: EIN $99 and expedited $69", () => {
  assertEquals(buildLineItems("starter", "llc", ["ein", "expedited"]).totalCents, 27400 + 9900 + 6900);
});

Deno.test("Business + Website LLC is $1,199 + $125 state fee, with EIN and expedited included", () => {
  assertEquals(buildLineItems("business_website", "llc", ["ein", "expedited"]).totalCents, 132400);
});
