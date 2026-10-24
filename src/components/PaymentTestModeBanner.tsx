import { useLang } from "@/i18n/LanguageContext";

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;

export function PaymentTestModeBanner() {
  const { t } = useLang();
  if (!clientToken) {
    return (
      <div className="fixed bottom-0 inset-x-0 z-50 bg-destructive/10 border-t border-destructive/30 px-4 py-2 text-center text-sm text-destructive">
        {t("Checkout is not configured yet. Payments are unavailable.")}
      </div>
    );
  }
  if (clientToken.startsWith("pk_test_")) {
    return (
      <div className="fixed bottom-0 inset-x-0 z-50 bg-background border-t border-accent/30 px-4 py-2 text-center text-sm text-foreground">
        {t("Test mode: no real payments are charged. Use card 4242 4242 4242 4242.")}
      </div>
    );
  }
  return null;
}
