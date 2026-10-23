import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AddCircleIcon, MinusSignCircleIcon } from "hugeicons-react";

const faqs = [
  {
    question: "Do I need to live in Florida or the US?",
    answer: "No. Anyone can own a Florida LLC or corporation. You just need a registered agent with a Florida address, which we provide.",
  },
  {
    question: "How long does formation take?",
    answer: "Most Florida filings are submitted within 1 business day and approved by the state in 1–5 business days. Your EIN usually follows within a few days.",
  },
  {
    question: "LLC or corporation: which is right for me?",
    answer: "Most small businesses choose an LLC for its simplicity and flexible taxes. A corporation can be better if you plan to raise investment. We can help you decide.",
  },
  {
    question: "What does a registered agent do?",
    answer: "A registered agent receives legal notices and official state mail for your company. Florida requires every company to have one. Ours is included for the first year, then $99/year.",
  },
];

const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="contact" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column - Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className=""
          >
            <div className="inline-block px-6 py-2 bg-[#F6F8F7] border border-[#E8E8E8] rounded-[100px] mb-6">
              <p className="text-[12px] font-medium text-[#1F2420]">
                // FAQ //
              </p>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-[40px] font-medium text-foreground leading-tight">
              We're here to answer your questions
            </h2>
          </motion.div>

          {/* Right Column - Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#F7F8F7] rounded-[24px] p-2 flex flex-col gap-2"
          >
            {faqs.map((faq, index) => (
              <div
                key={index}
                onClick={() => handleClick(index)}
                className={`relative bg-background rounded-[16px] p-5 cursor-pointer transition-all duration-300 ${
                  expandedIndex === index ? "shadow-sm" : "hover:shadow-sm"
                }`}
                style={{
                  boxShadow: expandedIndex === index 
                    ? '0px 1px 4px rgba(12, 12, 13, 0.1), 0px 1px 4px rgba(12, 12, 13, 0.05)' 
                    : undefined
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-[18px] font-medium text-foreground">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {expandedIndex === index ? (
                      <MinusSignCircleIcon className="w-6 h-6 text-[#5A6B5D]" />
                    ) : (
                      <AddCircleIcon className="w-6 h-6 text-[#5A6B5D]" />
                    )}
                  </div>
                </div>
                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[15px] text-muted-foreground leading-relaxed mt-4">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
