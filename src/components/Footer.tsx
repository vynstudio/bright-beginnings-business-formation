import { useLang } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";
const Footer = () => {
  const { t } = useLang();
  const navLinks = [{
    label: "About",
    href: "/about"
  }, {
    label: "Blog",
    href: "/blog"
  }, {
    label: "Contact us",
    href: "/contact"
  }, {
    label: "Florida LLC vs corporation",
    href: "/florida-llc-vs-corporation"
  }, {
    label: "EIN application",
    href: "/ein-application"
  }, {
    label: "Registered agent renewal",
    href: "/registered-agent-renewal"
  }, {
    label: "Legal disclaimer",
    href: "/legal-disclaimer"
  }, {
    label: "Privacy policy",
    href: "/privacy"
  }];
  return <footer className="py-6 bg-background">
      <div className="container mx-auto px-4">
        <div className="bg-muted rounded-[24px] px-6 md:px-8 pt-12 pb-6 lg:px-12">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-[17px] font-semibold text-foreground leading-tight">{t("Agente Registrado ")}<span className="text-lime">{t("Florida")}</span></span>
            </Link>
          </div>

          {/* Navigation Links - Right */}
          <div className="lg:flex-shrink-0">
            <ul className="flex flex-row flex-wrap gap-x-6 gap-y-2 lg:flex-col lg:space-y-3 lg:gap-0">
              {navLinks.map(link => <li key={t(link.label)}>
                  <Link to={link.href} className="text-[15px] text-foreground hover:text-foreground/70 transition-colors">
                    {t(link.label)}
                  </Link>
                </li>)}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-6">
          {/* Bottom Row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-[13px] sm:text-[14px] text-foreground">
              {t("© 2026 Agente Registrado Florida. All rights reserved.")}
            </p>
          </div>
        </div>
        </div>
      </div>
    </footer>;
};
export default Footer;