import { useLang } from "@/i18n/LanguageContext";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
const Footer = () => {
  const { t } = useLang();
  const navLinks = [{
    {t("label: \"About\",")}
    {t("href: \"/about\"")}
  }, {
    {t("label: \"Blog\",")}
    {t("href: \"/blog\"")}
  }, {
    {t("label: \"Contact us\",")}
    {t("href: \"/contact\"")}
  }];
  const socialLinks = [{
    {t("label: \"BUILT WITH LOVABLE\",")}
    {t("href: \"https://lovable.dev\"")}
  }];
  return <footer className="py-6 bg-background">
      <div className="container mx-auto px-4">
        <div className="bg-[#F7F8F7] rounded-[24px] px-6 md:px-8 pt-12 pb-6 lg:px-12">
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

        {/* Social Links */}
        <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-8">
          {socialLinks.map(link => <a key={t(link.label)} href={link.href} target="_blank" rel="noopener noreferrer" className="text-[13px] font-normal text-foreground hover:text-foreground/70 transition-colors inline-flex items-center gap-1.5 tracking-wide group">
              {t(link.label)}
              <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:rotate-45" />
            </a>)}
        </div>

        {/* Divider */}
        <div className="border-t border-[#E8E8E8] pt-6">
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