import { useLang } from "@/i18n/LanguageContext";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
const PricingSection = () => {
  const { t } = useLang();
  const starterFeatures = ["Articles filed with Sunbiz", "1 year of registered agent service", "Digital company documents", "Email support", "Name availability check"];
  const coreFeatures = ["Everything in Basic", "EIN from the IRS", "Operating agreement or bylaws", "Banking resolution", "Phone and WhatsApp support"];
  const customFeatures = ["Everything in Standard", "Annual report filing for 1 year", "Help with ITIN for international owners", "US business bank account guidance", "Priority same-day filing"];
  
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:max-w-xl"
          >
            {/* Badge */}
            <div className="inline-block px-6 py-2 bg-[#F6F8F7] border border-[#E8E8E8] rounded-[100px] mb-4">
              <p className="text-[12px] font-medium text-[#1F2420]">// Pricing //</p>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-[40px] font-medium text-foreground leading-tight">
              {t("Simple pricing, plus state fees")}
            </h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground lg:max-w-xs lg:text-right lg:pt-12"
          >
            {t("One-time formation fee. Florida state filing fee ($125 for an LLC, $70 for a corporation) is added at checkout.")}
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#F7F8F7] rounded-[20px] p-2 flex flex-col"
          >
            {/* Title Card */}
            <div 
              className="bg-white rounded-[16px] p-5 mb-2"
              style={{
                boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.1), 0px 1px 4px rgba(12, 12, 13, 0.05)'
              }}
            >
              <h3 className="text-lg font-medium text-foreground mb-4">{t("Basic")}</h3>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-foreground">
                  $49
                </span>
                <span className="text-muted-foreground">{t("+ state fee")}</span>
              </div>

              <Button asChild variant="outline" className="w-full rounded-full">
                <Link to="/contact">{t("GET STARTED")}</Link>
              </Button>
            </div>

            {/* Features */}
            <ul className="space-y-3 px-3 py-4 flex-1">
              {starterFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FF520A' }} />
                  <span className="text-foreground">{t(feature)}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Core Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#F7F8F7] rounded-[20px] p-2 flex flex-col"
          >
            {/* Title Card */}
            <div 
              className="bg-white rounded-[16px] p-5 mb-2"
              style={{
                boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.1), 0px 1px 4px rgba(12, 12, 13, 0.05)'
              }}
            >
              <h3 className="text-lg font-medium text-foreground mb-4">{t("Standard")}</h3>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-foreground">
                  $149
                </span>
                <span className="text-muted-foreground">{t("+ state fee")}</span>
              </div>

              <Button asChild variant="lime" className="w-full rounded-full">
                <Link to="/contact">{t("GET STARTED")}</Link>
              </Button>
            </div>

            {/* Features */}
            <ul className="space-y-3 px-3 py-4 flex-1">
              {coreFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FF520A' }} />
                  <span className="text-foreground">{t(feature)}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Custom Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#1F2420] rounded-[20px] p-2 flex flex-col"
          >
            {/* Title Card */}
            <div 
              className="bg-[#2A2F2B] rounded-[16px] p-5 mb-2"
              style={{
                boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.3), 0px 1px 4px rgba(0, 0, 0, 0.2)'
              }}
            >
              <h3 className="text-lg font-medium text-white mb-4">{t("Premium")}</h3>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">$299</span>
                <span className="text-white/70">{t("+ state fee")}</span>
              </div>

              <Button asChild variant="heroOutline" className="w-full bg-white text-foreground hover:bg-white/90 rounded-full py-2 pr-[2px] pl-6 relative justify-center">
                <Link to="/contact">
                  {t("GET STARTED")}
                  <span className="bg-foreground rounded-full p-2 absolute right-2">
                    <ArrowUpRight size={18} className="text-background" />
                  </span>
                </Link>
              </Button>
            </div>

            {/* Features */}
            <ul className="space-y-3 px-3 py-4 flex-1">
              {customFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FF520A' }} />
                  <span className="text-white/90">{t(feature)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default PricingSection;