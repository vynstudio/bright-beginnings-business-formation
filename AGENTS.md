# Agent rules

- Site text is translated with `t("English text")` from `src/i18n/LanguageContext.tsx`; the English string is the key in `src/i18n/translations.ts` (es, pt). Why: missing translations fall back to English, so adding copy never breaks a language.
