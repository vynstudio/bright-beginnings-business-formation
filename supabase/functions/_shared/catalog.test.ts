import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { buildLineItems } from "./catalog.ts";

Deno.test("Starter LLC is $99 + $125 state fee", () => {
  assertEquals(buildLineItems("starter", "llc", []).totalCents, 22400);
});

Deno.test("International+ corporation is $399 + $70 state fee", () => {
  assertEquals(buildLineItems("international", "corp", []).totalCents, 46900);
});

Deno.test("Extras already included in the plan are not charged again", () => {
  assertEquals(buildLineItems("professional", "llc", ["ein", "expedited"]).totalCents, 32400);
});

Deno.test("Annual report adds $99 plus the Florida annual report fee", () => {
  assertEquals(buildLineItems("starter", "llc", ["annual_report"]).totalCents, 22400 + 9900 + 13875);
});
