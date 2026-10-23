import { motion } from "framer-motion";
import logoShopify from "@/assets/logo-shopify.png";
import logoWebflow from "@/assets/logo-webflow.png";
import logoCalendly from "@/assets/logo-calendly.png";
import logoHubspot from "@/assets/logo-hubspot.png";
import logoClickup from "@/assets/logo-clickup.png";
import logoCloudways from "@/assets/logo-cloudways.png";
import logoMailchimp from "@/assets/logo-mailchimp.png";

interface LogoStripProps {
  label?: string;
}

const LogoStrip = ({ label = "Trusted by founders in 30+ countries" }: LogoStripProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex flex-col md:flex-row items-center gap-4 md:gap-8"
    >
      <p className="text-[14px] md:text-[16px] text-[#59605A] shrink-0 text-center md:text-left max-w-[210px]">
        {label}
      </p>
      <div className="flex-1 w-full max-w-full overflow-hidden">
        <motion.div
          className="flex items-center gap-4 md:gap-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {/* First set of logos */}
          <img src={logoShopify} alt="Shopify" width={148} height={100} className="w-[100px] md:w-[148px] shrink-0 opacity-70" loading="lazy" />
          <img src={logoWebflow} alt="Webflow" width={148} height={100} className="w-[100px] md:w-[148px] shrink-0 opacity-70" loading="lazy" />
          <img src={logoCalendly} alt="Calendly" width={148} height={100} className="w-[100px] md:w-[148px] shrink-0 opacity-70" loading="lazy" />
          <img src={logoHubspot} alt="HubSpot" width={148} height={100} className="w-[100px] md:w-[148px] shrink-0 opacity-70" loading="lazy" />
          <img src={logoClickup} alt="ClickUp" width={148} height={100} className="w-[100px] md:w-[148px] shrink-0 opacity-70" loading="lazy" />
          <img src={logoCloudways} alt="Cloudways" width={148} height={100} className="w-[100px] md:w-[148px] shrink-0 opacity-70" loading="lazy" />
          <img src={logoMailchimp} alt="Mailchimp" width={148} height={100} className="w-[100px] md:w-[148px] shrink-0 opacity-70" loading="lazy" />
          {/* Duplicate set for seamless loop */}
          <img src={logoShopify} alt="Shopify" width={148} height={100} className="w-[100px] md:w-[148px] shrink-0 opacity-70" loading="lazy" />
          <img src={logoWebflow} alt="Webflow" width={148} height={100} className="w-[100px] md:w-[148px] shrink-0 opacity-70" loading="lazy" />
          <img src={logoCalendly} alt="Calendly" width={148} height={100} className="w-[100px] md:w-[148px] shrink-0 opacity-70" loading="lazy" />
          <img src={logoHubspot} alt="HubSpot" width={148} height={100} className="w-[100px] md:w-[148px] shrink-0 opacity-70" loading="lazy" />
          <img src={logoClickup} alt="ClickUp" width={148} height={100} className="w-[100px] md:w-[148px] shrink-0 opacity-70" loading="lazy" />
          <img src={logoCloudways} alt="Cloudways" width={148} height={100} className="w-[100px] md:w-[148px] shrink-0 opacity-70" loading="lazy" />
          <img src={logoMailchimp} alt="Mailchimp" width={148} height={100} className="w-[100px] md:w-[148px] shrink-0 opacity-70" loading="lazy" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LogoStrip;
