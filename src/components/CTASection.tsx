import { useLang } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Photo from "@/components/Photo";

const CTASection = () => {
  const { t } = useLang();
  return (
    <section className="py-12 md:py-20 container mx-auto px-4">
      <div className="rounded-[24px] h-[400px] sm:h-[480px] flex items-center justify-center relative overflow-hidden px-4">
        <Photo name="tropical-sunset-palms" sizes="(min-width: 1312px) 1280px, calc(100vw - 32px)" className="absolute inset-0 w-full h-full" />
        {/* White gradient overlay keeps the dark heading readable over the photo */}
        <div className="absolute inset-0 rounded-[24px]" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.45) 100%)' }} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center relative z-10 w-full max-w-2xl"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-medium text-foreground mb-6 sm:mb-8 px-2">
            {t("Start your Florida business today")}
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-2 sm:px-0">
            <Link to="/start" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 rounded-full p-2 pl-6 text-base font-medium h-12 transition-colors">
              {t("START MY BUSINESS")}
              <span className="bg-background rounded-full p-2">
                <ArrowUpRight size={24} className="text-foreground" />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
