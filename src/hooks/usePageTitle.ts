import { useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";

const SITE = "Agente Registrado Florida";

// Sets the browser tab title for the current page, in the visitor's language.
// Text without a translation (blog post titles) is used as is.
export const usePageTitle = (title: string) => {
  const { t } = useLang();
  const text = title ? `${t(title)} | ${SITE}` : SITE;
  useEffect(() => { document.title = text; }, [text]);
};
