import { useEffect } from "react";
import { BRAND, useLang } from "@/i18n/LanguageContext";

// Sets the browser tab title for the current page, in the visitor's language.
// Text without a translation (blog post titles) is used as is.
export const usePageTitle = (title: string) => {
  const { t, lang } = useLang();
  const text = title ? `${t(title)} | ${BRAND[lang]}` : BRAND[lang];
  useEffect(() => { document.title = text; }, [text]);
};
