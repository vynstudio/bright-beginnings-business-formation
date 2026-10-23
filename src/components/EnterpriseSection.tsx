import { useLang } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import enterpriseVideo from "@/assets/enterprise-ball.mp4";

const features = [
  {
    title: "New entrepreneurs",
    description: "Start your first LLC the right way",
  },
  {
    title: "International founders",
    description: "Open a US company without living in the US",
  },
  {
    title: "Growing businesses",
    description: "Convert or add a corporation as you scale",
  },
  {
    title: "Existing Florida companies",
    description: "Switch your registered agent and catch up on filings",
  },
];

const EnterpriseSection = () => {
  const { t } = useLang();
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="inline-block px-6 py-2 bg-[#F6F8F7] border border-[#E8E8E8] rounded-[100px] mb-4">
            <p className="text-[12px] font-medium text-[#1F2420]">
              {t("// Who it's for //")}
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-[40px] font-medium text-foreground leading-tight">
            {t("Built for every kind of founder")}
          </h2>
        </motion.div>

        {/* Main Image with Floating Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mb-8"
        >
          <div className="relative w-full h-[480px] bg-[#E8E6DF] rounded-[24px] overflow-hidden">
            <video
              src={enterpriseVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-[center_0%]"
            />
            {/* Floating card */}
            <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto bg-background rounded-[16px] p-6 shadow-lg md:max-w-[320px]">
              <p className="text-[20px] font-semibold text-foreground mb-2">Start in 10 minutes</p>
              <p className="text-[15px] text-muted-foreground mb-6 leading-relaxed">
                {t("Answer a few questions online and we take care of the paperwork with the State of Florida.")}
              </p>
              <Button asChild variant="lime" size="default" className="rounded-full px-8">
                <Link to="/contact">{t("START NOW")}</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Features Grid - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#F7F8F7] rounded-[16px] p-[20px]"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-[12px] h-[26px] bg-[#FF7732] rounded-full mt-0.5" style={{ transform: "rotate(30deg)" }} />
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground mb-1">
                    {t(feature.title)}
                  </h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {t(feature.description)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnterpriseSection;
