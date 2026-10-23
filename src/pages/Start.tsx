import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Plus, Trash2, Loader2 } from "lucide-react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlanAdvisor, { type Recommendation } from "@/components/PlanAdvisor";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLang } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { EXTRAS, INCLUDED, PLANS, STATE_FEE, money, orderTotal, type Entity, type Extra, type Plan } from "@/lib/catalog";

type Owner = { name: string; ownership: string };

const isPlan = (v: string | null): v is Plan => v === "starter" || v === "professional" || v === "international";

const Start = () => {
  const { t, lang } = useLang();
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<Plan>(isPlan(params.get("plan")) ? (params.get("plan") as Plan) : "professional");
  const [entity, setEntity] = useState<Entity>(params.get("entity") === "corp" ? "corp" : "llc");
  const [extras, setExtras] = useState<Extra[]>([]);
  const [form, setForm] = useState({
    companyName: "", altCompanyName: "", businessPurpose: "",
    contactName: "", contactEmail: "", contactPhone: "", country: "", address: "",
  });
  const [owners, setOwners] = useState<Owner[]>([{ name: "", ownership: "100" }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [starting, setStarting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const available = EXTRAS.filter((x) => !INCLUDED[plan].includes(x.id));
  const chosen = extras.filter((e) => !INCLUDED[plan].includes(e));
  const summary = useMemo(() => orderTotal(plan, entity, chosen), [plan, entity, chosen]);

  const applyRec = (r: Recommendation) => {
    setPlan(r.plan);
    setEntity(r.entityType);
    setExtras(r.extras);
    document.getElementById("package")?.scrollIntoView({ behavior: "smooth" });
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e: Record<string, string> = {};
    const req = t("Required");
    if (!form.companyName.trim()) e.companyName = req;
    if (!form.contactName.trim()) e.contactName = req;
    if (!/^\S+@\S+\.\S+$/.test(form.contactEmail.trim())) e.contactEmail = t("Enter a valid email");
    if (form.contactPhone.trim().length < 6) e.contactPhone = req;
    if (!form.country.trim()) e.country = req;
    if (!form.address.trim()) e.address = req;
    owners.forEach((o, i) => { if (!o.name.trim()) e[`owner${i}`] = req; });
    const totalPct = owners.reduce((s, o) => s + (Number(o.ownership) || 0), 0);
    if (Math.round(totalPct) !== 100) e.ownership = t("Ownership must add up to 100%");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goToPayment = async () => {
    if (!validate()) return;
    setStarting(true);
    setCheckoutError(null);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
          language: lang, plan, entityType: entity, extras: chosen,
          ...form,
          owners: owners.map((o) => ({ name: o.name, ownership: Number(o.ownership) || 0 })),
        },
      });
      if (error || !data?.clientSecret) throw new Error();
      setClientSecret(data.clientSecret);
      setStep(3);
      window.scrollTo({ top: 0 });
    } catch {
      setCheckoutError(t("Could not start checkout. Please try again."));
    } finally {
      setStarting(false);
    }
  };

  const field = (k: keyof typeof form, label: string, opts: { type?: string; textarea?: boolean; optional?: boolean } = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={k}>{t(label)}{opts.optional && <span className="text-muted-foreground"> ({t("optional")})</span>}</Label>
      {opts.textarea ? (
        <Textarea id={k} value={form[k]} onChange={set(k)} maxLength={500} rows={3} />
      ) : (
        <Input id={k} type={opts.type ?? "text"} value={form[k]} onChange={set(k)} maxLength={k === "address" ? 300 : 120} aria-invalid={!!errors[k]} />
      )}
      {errors[k] && <p className="text-xs text-destructive">{errors[k]}</p>}
    </div>
  );

  const steps = ["Package", "Your details", "Payment"];

  return (
    <div className="min-h-dvh bg-background">
      <PaymentTestModeBanner />
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl md:text-[40px] font-medium text-foreground leading-tight">{t("Start your Florida business")}</h1>
          <ol className="mt-4 mb-8 flex flex-wrap gap-2 text-sm" aria-label={t("Progress")}>
            {steps.map((s, i) => (
              <li key={s} aria-current={step === i + 1 ? "step" : undefined}
                className={`rounded-full px-4 py-1.5 border ${step === i + 1 ? "bg-foreground text-background border-foreground" : step > i + 1 ? "border-border text-foreground" : "border-border text-muted-foreground"}`}>
                {i + 1}. {t(s)}
              </li>
            ))}
          </ol>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
            <div className="space-y-8 min-w-0">
              {step === 1 && (
                <>
                  <PlanAdvisor onApply={applyRec} />

                  <section id="package" className="space-y-4 scroll-mt-32">
                    <h2 className="text-xl font-semibold text-foreground">{t("Company type")}</h2>
                    <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label={t("Company type")}>
                      {(["llc", "corp"] as Entity[]).map((e) => (
                        <button key={e} type="button" role="radio" aria-checked={entity === e} onClick={() => setEntity(e)}
                          className={`text-left rounded-2xl border p-4 transition-colors ${entity === e ? "border-accent bg-accent/5" : "border-border hover:border-foreground/30"}`}>
                          <p className="font-semibold text-foreground">{e === "llc" ? t("Florida LLC") : t("Florida corporation")}</p>
                          <p className="text-sm text-muted-foreground">
                            {e === "llc" ? t("Simple and flexible. Best for most small businesses.") : t("Best if you plan to raise investment or issue shares.")}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">{t("State fee")}: {money(STATE_FEE[e])}</p>
                        </button>
                      ))}
                    </div>

                    <h2 className="text-xl font-semibold text-foreground pt-4">{t("Package")}</h2>
                    <div className="grid md:grid-cols-3 gap-3" role="radiogroup" aria-label={t("Package")}>
                      {PLANS.map((p) => (
                        <button key={p.id} type="button" role="radio" aria-checked={plan === p.id} onClick={() => setPlan(p.id)}
                          className={`text-left rounded-2xl border p-4 transition-colors ${plan === p.id ? "border-accent bg-accent/5" : "border-border hover:border-foreground/30"}`}>
                          <p className="font-semibold text-foreground">{t(p.name)}</p>
                          <p className="text-2xl font-bold text-foreground mt-1">{money(p.price)} <span className="text-xs font-normal text-muted-foreground">{t("+ state fee")}</span></p>
                          <ul className="mt-3 space-y-1.5">
                            {p.features.map((f) => (
                              <li key={f} className="flex gap-1.5 text-xs text-foreground"><Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent" />{t(f)}</li>
                            ))}
                          </ul>
                        </button>
                      ))}
                    </div>

                    {available.length > 0 && (
                      <>
                        <h2 className="text-xl font-semibold text-foreground pt-4">{t("Add-ons")}</h2>
                        <div className="space-y-2">
                          {available.map((x) => (
                            <label key={x.id} className="flex items-center gap-3 rounded-xl border border-border p-3 cursor-pointer">
                              <Checkbox checked={extras.includes(x.id)}
                                onCheckedChange={(c) => setExtras(c ? [...extras, x.id] : extras.filter((e) => e !== x.id))} />
                              <span className="flex-1 text-sm text-foreground">{t(x.name)}</span>
                              <span className="text-sm font-medium text-foreground">{money(x.price)}{x.note && <span className="text-xs text-muted-foreground"> {t(x.note)}</span>}</span>
                            </label>
                          ))}
                        </div>
                      </>
                    )}
                  </section>
                  <Button onClick={() => { setStep(2); window.scrollTo({ top: 0 }); }} className="rounded-full">{t("Continue")}</Button>
                </>
              )}

              {step === 2 && (
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">{t("Company")}</h2>
                    {field("companyName", "Company name")}
                    {field("altCompanyName", "Backup name, in case the first is taken", { optional: true })}
                    {field("businessPurpose", "What will the business do?", { textarea: true, optional: true })}
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-foreground">{t("Owners")}</h2>
                    {owners.map((o, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-1">
                          <Label htmlFor={`owner-${i}`} className="sr-only">{t("Owner full name")}</Label>
                          <Input id={`owner-${i}`} placeholder={t("Owner full name")} value={o.name} maxLength={120}
                            onChange={(e) => setOwners(owners.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                          {errors[`owner${i}`] && <p className="text-xs text-destructive">{errors[`owner${i}`]}</p>}
                        </div>
                        <div className="w-24">
                          <Label htmlFor={`own-${i}`} className="sr-only">{t("Ownership %")}</Label>
                          <Input id={`own-${i}`} type="number" min={0} max={100} value={o.ownership} aria-label={t("Ownership %")}
                            onChange={(e) => setOwners(owners.map((x, j) => (j === i ? { ...x, ownership: e.target.value } : x)))} />
                        </div>
                        {owners.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" aria-label={t("Remove owner")} onClick={() => setOwners(owners.filter((_, j) => j !== i))}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {errors.ownership && <p className="text-xs text-destructive">{errors.ownership}</p>}
                    {owners.length < 10 && (
                      <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => setOwners([...owners, { name: "", ownership: "0" }])}>
                        <Plus className="w-4 h-4" /> {t("Add owner")}
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">{t("Contact person")}</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {field("contactName", "Full name")}
                      {field("contactEmail", "Email", { type: "email" })}
                      {field("contactPhone", "Phone or WhatsApp", { type: "tel" })}
                      {field("country", "Country where you live")}
                    </div>
                    {field("address", "Mailing address")}
                  </div>

                  {checkoutError && <p role="alert" className="text-sm text-destructive">{checkoutError}</p>}
                  <div className="flex gap-3">
                    <Button variant="outline" className="rounded-full" onClick={() => setStep(1)}>{t("Back")}</Button>
                    <Button className="rounded-full" onClick={goToPayment} disabled={starting}>
                      {starting && <Loader2 className="w-4 h-4 animate-spin" />}{t("Continue to payment")}
                    </Button>
                  </div>
                </section>
              )}

              {step === 3 && clientSecret && (
                <section aria-label={t("Payment")}>
                  <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                </section>
              )}
            </div>

            <aside className="rounded-[20px] bg-muted/50 p-5 lg:sticky lg:top-32" aria-label={t("Order summary")}>
              <h2 className="font-semibold text-foreground mb-3">{t("Order summary")}</h2>
              <p className="text-sm text-muted-foreground mb-3">{entity === "llc" ? t("Florida LLC") : t("Florida corporation")}</p>
              <ul className="space-y-2 text-sm">
                {summary.lines.map((l) => (
                  <li key={l.label} className="flex justify-between gap-3"><span className="text-foreground">{t(l.label)}</span><span className="text-foreground">{money(l.amount)}</span></li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-border flex justify-between font-semibold text-foreground">
                <span>{t("Total")}</span><span data-testid="order-total">{money(summary.total)}</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{t("One-time payment. Sales tax, if any, is shown at checkout.")}</p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Start;
