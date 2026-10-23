import { useLang } from "@/i18n/LanguageContext";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroVideo from "@/assets/hero-video.mp4";
import LogoStrip from "@/components/LogoStrip";

const HeroSection = () => {
  const { t } = useLang();
  return (
    <section className="relative pb-12 md:pb-16 overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-8"
        >
          {/* Main Headline */}
          <h1 className="text-[44px] sm:text-[60px] md:text-[76px] font-medium text-foreground leading-none mb-6 text-balance">
            {t("Agente Registrado Florida")}
          </h1>

          {/* Subheadline */}
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            {t("Form your Florida LLC or corporation, get your EIN and stay compliant — from anywhere in the world.")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/start" className="inline-flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 rounded-full py-2 pr-2 pl-6 text-sm font-medium h-10 transition-colors">
              {t("START MY BUSINESS")}
              <span className="bg-background rounded-full p-1.5">
                <ArrowUpRight size={18} className="text-foreground" />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Hero Video - container width */}
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mt-8 mb-12"
        >
          <div className="w-full max-w-[1280px] h-[500px] overflow-hidden rounded-[24px] flex items-center justify-center">
            <video
              src={heroVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="min-w-[104%] min-h-[104%] object-cover"
            />
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4">

        {/* Client Logos */}
        <LogoStrip />
      </div>
    </section>
  );
};

export default HeroSection;
