import { useLang } from "@/i18n/LanguageContext";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckmarkCircle02Icon } from "hugeicons-react";
import Photo from "@/components/Photo";

const steps = [{
  title: "1. Choose your company type",
  description: "Pick an LLC or corporation and tell us your company name. We check that the name is available in Florida."
}, {
  title: "2. We file with the State of Florida",
  description: "We prepare your Articles of Organization or Incorporation and submit them to Sunbiz, acting as your registered agent."
}, {
  title: "3. Get your EIN and documents",
  description: "Receive your approved company documents and operating agreement, plus your IRS EIN if it's included in your order."
}, {
  title: "4. Stay compliant",
  description: "We forward state mail, remind you of deadlines and can file your annual report for you."
}];

const TIMER_DURATION = 10000; // 10 seconds

const HowItWorksSection = () => {
  const { t } = useLang();
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const goToNext = useCallback(() => {
    setExpandedIndex((prev) => (prev + 1) % steps.length);
    setProgress(0);
  }, []);

  const handleManualClick = (index: number) => {
    setExpandedIndex(index);
    setProgress(0);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + (100 / (TIMER_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [goToNext]);
  return <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="mb-12">
          <div className="inline-block px-6 py-2 bg-[#F6F8F7] border border-[#E8E8E8] rounded-[100px] mb-2">
            <p className="text-[12px] font-medium text-[#1F2420]">
              {t("// Product explanation //")}
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-[40px] font-medium text-foreground">
            {t("How it works")}
          </h2>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-[24px] items-stretch">
          {/* Left - Accordion Cards */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="bg-[#F7F8F7] rounded-[24px] p-3 flex flex-col gap-2 py-[8px] px-[8px]">
            {steps.map((step, index) => <div key={index} role="button" tabIndex={0} aria-expanded={expandedIndex === index} onClick={() => handleManualClick(index)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleManualClick(index); } }} className={`relative bg-background rounded-[16px] p-5 cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${expandedIndex === index ? "shadow-sm" : "hover:shadow-sm"}`} style={{
            boxShadow: expandedIndex === index ? '0px 1px 4px rgba(12, 12, 13, 0.1), 0px 1px 4px rgba(12, 12, 13, 0.05)' : undefined
          }}>
                {/* Timer progress bar - top right corner */}
                {expandedIndex === index && (
                  <div className="absolute top-5 right-5 w-16 h-[3px] bg-[#E8ECEA] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#5A6B5D]"
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-11 h-11 bg-[#E8ECEA] rounded-[12px] flex items-center justify-center">
                    <CheckmarkCircle02Icon className="w-5 h-5 text-[#5A6B5D]" />
                  </div>
                  <h3 className="text-[18px] font-medium text-foreground">
                    {t(step.title)}
                  </h3>
                </div>
                <AnimatePresence>
                  {expandedIndex === index && <motion.div initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: "auto",
                opacity: 1
              }} exit={{
                height: 0,
                opacity: 0
              }} transition={{
                duration: 0.3
              }} className="overflow-hidden">
                      <p className="text-[15px] text-muted-foreground leading-relaxed mt-4 pl-0 sm:pl-[60px]">
                        {t(step.description)}
                      </p>
                    </motion.div>}
                </AnimatePresence>
              </div>)}
          </motion.div>

          {/* Right - Looper Image */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="bg-[#F7F8F7] rounded-[24px] flex items-center justify-center min-h-[400px] lg:min-h-0">
            <Photo name="man-on-laptop" sizes="(min-width: 1024px) 640px, calc(100vw - 32px)" className="w-full h-full min-h-[400px] rounded-[24px]" />
          </motion.div>
        </div>
      </div>
    </section>;
};
export default HowItWorksSection;