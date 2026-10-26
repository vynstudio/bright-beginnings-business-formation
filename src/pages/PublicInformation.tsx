import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BRAND, useLang } from "@/i18n/LanguageContext";
import { publicPages, type PublicPageKey } from "@/content/publicPages";
import Photo, { type PhotoName } from "@/components/Photo";
import { usePageTitle } from "@/hooks/usePageTitle";

const pagePhotos: Partial<Record<PublicPageKey, PhotoName>> = {
  "florida-llc-vs-corporation": "signing-contract",
  "ein-application": "man-signing-documents",
  "registered-agent-renewal": "colleagues-discussing",
};

export default function PublicInformation({ pageKey }: { pageKey: PublicPageKey }) {
  const { t, lang } = useLang();
  const page = publicPages[pageKey];
  usePageTitle(page.title);
  return <div className="min-h-dvh bg-background text-foreground">
    <Header />
    <main id="main-content" tabIndex={-1} className="pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <header className="border-b border-border pb-8">
          <p className="text-sm font-medium text-muted-foreground mb-4">{BRAND[lang]} · Diler Services, LLC</p>
          <h1 className="text-3xl md:text-5xl leading-tight font-medium break-words">{t(page.title)}</h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-3xl">{t(page.intro)}</p>
          {"updated" in page ? <p className="mt-4 text-sm text-muted-foreground">{t(page.updated)}</p>
            : (pageKey === "privacy" || pageKey === "legal-disclaimer") && <p className="mt-4 text-sm text-muted-foreground">{t("Updated October 24, 2026")}</p>}
          {page.draft && <p className="mt-4 border-l-4 border-accent pl-4 font-medium">{t("Draft — owner review required")}</p>}
        </header>
        {pagePhotos[pageKey] && <div className="mt-8 h-[220px] sm:h-[340px] overflow-hidden rounded-[24px]">
          <Photo name={pagePhotos[pageKey]!} priority sizes="(min-width: 1056px) 1024px, calc(100vw - 32px)" className="w-full h-full" />
        </div>}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_220px] gap-12 py-10">
          <article className="space-y-10 min-w-0">
            {page.sections.map(section => <section key={section.title}>
              <h2 className="text-xl md:text-2xl font-medium mb-4">{t(section.title)}</h2>
              {section.paragraphs.map(text => <p key={text} className="text-muted-foreground leading-7">{t(text)}</p>)}
            </section>)}
            {page.actions.length > 0 && <div className="flex flex-wrap gap-3 border-t border-border pt-6">
              {page.actions.map(action => <Button key={action.href} asChild className="h-auto min-h-12 whitespace-normal text-center py-3"><Link to={action.href}>{t(action.label)}<ArrowUpRight className="shrink-0" /></Link></Button>)}
            </div>}
          </article>
          <aside className="border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-6">
            <h2 className="text-sm font-semibold mb-5">{t("Related pages")}</h2>
            <nav className="flex flex-col gap-4" aria-label={t("Related pages")}>
              {Object.entries(publicPages).filter(([key]) => key !== pageKey).map(([key, item]) => <Link key={key} to={`/${key}`} className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">{t(item.title)}</Link>)}
              {pageKey === "ein-application" && <a href="https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number" target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4">IRS · EIN <ArrowUpRight className="inline h-3 w-3" /></a>}
              {(pageKey === "florida-llc-vs-corporation" || pageKey === "registered-agent-renewal") && <a href="https://dos.fl.gov/sunbiz/" target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4">Florida Sunbiz <ArrowUpRight className="inline h-3 w-3" /></a>}
            </nav>
          </aside>
        </div>
      </div>
    </main>
    <Footer />
  </div>;
}