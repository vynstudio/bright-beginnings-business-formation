import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/i18n/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";

const CheckoutReturn = () => {
  const { t } = useLang();
  usePageTitle("Order received");
  const [params] = useSearchParams();
  const ok = !!params.get("session_id");
  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-40 pb-24">
        <div className="container mx-auto px-4 max-w-xl text-center">
          {ok ? (
            <>
              <CheckCircle2 className="w-12 h-12 mx-auto text-accent" aria-hidden />
              <h1 className="mt-4 text-3xl font-medium text-foreground">{t("Thank you! Your order is in.")}</h1>
              <p className="mt-3 text-muted-foreground">
                {t("We'll review your details and file with the State of Florida, usually within 1 business day. You'll get a receipt by email, and we'll contact you if anything is missing.")}
              </p>
              <p className="mt-3 text-muted-foreground">
                {t("If your order includes a website, we'll email you within 1 business day to collect your logo, photos and content.")}
              </p>
              <p className="mt-3 text-muted-foreground">
                {t("If your order includes an EIN and you have an SSN or ITIN, we'll call you to complete the IRS application. Never send it by email.")}
              </p>
            </>
          ) : (
            <h1 className="text-2xl font-medium text-foreground">{t("No order information found.")}</h1>
          )}
          <Link to="/" className="mt-8 inline-flex rounded-full bg-foreground text-background px-6 h-10 items-center text-sm font-medium">
            {t("Back to home")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutReturn;
