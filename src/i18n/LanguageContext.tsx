import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { translations } from "./translations";

export type Lang = "en" | "es" | "pt";
export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "pt", label: "PT" },
];

const detect = (): Lang => {
  const saved = localStorage.getItem("lang");
  if (saved === "en" || saved === "es" || saved === "pt") return saved;
  const nav = navigator.language.slice(0, 2);
  return nav === "es" || nav === "pt" ? nav : "en";
};

interface Ctx { lang: Lang; setLang: (l: Lang) => void; t: (text: string) => string }
const LanguageContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (s) => s });

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(detect);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l: Lang) => { localStorage.setItem("lang", l); setLangState(l); };
  // English text is the key; missing translations fall back to English.
  const t = useCallback((text: string) => (lang === "en" ? text : translations[text]?.[lang] ?? text), [lang]);
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
};

export const useLang = () => useContext(LanguageContext);
