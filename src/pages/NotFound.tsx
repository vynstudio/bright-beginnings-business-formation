import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLang();
  usePageTitle("Page not found");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-dvh items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t("Oops! Page not found")}</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          {t("Back to home")}
        </a>
      </div>
    </main>
  );
};

export default NotFound;
