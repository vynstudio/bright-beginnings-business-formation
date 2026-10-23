import { useLang } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import testimonialAvatar from "@/assets/testimonial-avatar.webp";

const testimonials = [
  {
    {t("quote: \"My LLC was ready in two days.\",")}
    {t("description: \"They handled everything, even the EIN, while I was still in Colombia.\",")}
    {t("author: \"Carlos R.\",")}
    {t("company: \"Bogotá\",")}
    {t("rating: 5,")}
  },
  {
    {t("quote: \"Finally, help in Spanish.\",")}
    {t("description: \"Every question was answered clearly in my language.\",")}
    {t("author: \"Ana P.\",")}
    {t("company: \"Miami\",")}
    {t("rating: 5,")}
  },
  {
    {t("quote: \"No more missed annual reports.\",")}
    {t("description: \"They remind me and file it for me every year.\",")}
    {t("author: \"James T.\",")}
    {t("company: \"Orlando\",")}
    {t("rating: 5,")}
  },
  {
    {t("quote: \"Simple and honest pricing.\",")}
    {t("description: \"I paid exactly what they quoted, plus the state fee.\",")}
    {t("author: \"Lucía M.\",")}
    {t("company: \"Madrid\",")}
    {t("rating: 5,")}
  },
  {
    {t("quote: \"Great registered agent service.\",")}
    {t("description: \"Legal mail is scanned and emailed the same day.\",")}
    {t("author: \"Daniel S.\",")}
    {t("company: \"Tampa\",")}
    {t("rating: 5,")}
  },
  {
    {t("quote: \"Easy switch from my old agent.\",")}
    {t("description: \"The change was filed with the state in one day.\",")}
    {t("author: \"Sofía V.\",")}
    {t("company: \"Mexico City\",")}
    {t("rating: 5,")}
  },
];

const TestimonialsSection = () => {
  const { t } = useLang();
  {t("return (")}
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Featured Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-2xl md:text-3xl lg:text-[48px] lg:leading-none font-medium text-foreground leading-[1.2] mb-8 max-w-4xl mx-auto">
            {t("\"Agente Registrado Florida made opening my business in the US simple\"")}
          </h3>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-muted overflow-hidden">
              <img 
                src={testimonialAvatar} 
                alt="Martha Punla"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-base font-medium text-foreground">María González</p>
              <p className="text-sm text-muted-foreground">{t("Founder, MG Imports LLC")}</p>
            </div>
          </div>
        </motion.div>

        {/* Auto-scrolling Testimonials */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              x: {
                {t("duration: 30,")}
                {t("repeat: Infinity,")}
                {t("ease: \"linear\",")}
              },
            }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#F7F8F7] rounded-[20px] p-2 flex flex-col flex-shrink-0 w-[280px] sm:w-[350px]"
              >
                {/* Content Container */}
                <div
                  className="bg-white rounded-[16px] p-5 mb-2"
                  style={{
                    {t("boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.1), 0px 1px 4px rgba(12, 12, 13, 0.05)'")}
                  }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#FF7732] text-[#FF7732]" />
                    ))}
                  </div>

                  {/* Quote Title */}
                  <h3 className="text-[18px] font-semibold text-[#1F2420] mb-3 leading-snug">
                    "{t(testimonial.quote)}"
                  </h3>

                  {/* Description */}
                  <p className="text-[15px] text-[#6B7280] leading-relaxed">
                    {t(testimonial.description)}
                  </p>
                </div>

                {/* Author */}
                <p className="text-[12px] text-[#6B7280] px-3 py-4">
                  — {testimonial.author}, {testimonial.company}
                </p>
              </div>
            ))}
          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
