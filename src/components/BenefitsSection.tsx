import { useLang } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
const benefits = [{
  {t("title: \"Clear, flat pricing\",")}
  {t("description: \"One price plus the state fee. No hidden charges or surprise renewals.\",")}
  {t("filled: 1")}
}, {
  {t("title: \"Fast filing\",")}
  {t("description: \"Most filings are submitted to the state within one business day.\",")}
  {t("filled: 2")}
}, {
  {t("title: \"Never miss a deadline\",")}
  {t("description: \"We remind you and file your annual report before the May 1 deadline.\",")}
  {t("filled: 4")}
}, {
  {t("title: \"Bilingual support\",")}
  {t("description: \"Talk to us in English or Spanish, by phone, email or WhatsApp.\",")}
  {t("filled: 4")}
}, {
  {t("title: \"Open from abroad\",")}
  {t("description: \"International founders can form a Florida company without traveling or a US address.\",")}
  {t("filled: 5")}
}, {
  {t("title: \"Privacy protected\",")}
  {t("description: \"Use our registered agent address on public records instead of your home address.\",")}
  {t("filled: 6")}
}];
const ProgressIndicator = ({
  {t("filled")}
}: {
  filled: number;
}) => {
  return <div className="mb-6 flex items-start justify-end gap-[8px]">
      {Array.from({
      {t("length: 6")}
    }).map((_, i) => <div key={i} className={`w-[12px] h-[26px] rounded-full ${i < filled ? "bg-[#FF7732]" : "border-2 border-[#FF7732]/40 bg-transparent"}`} style={{
      {t("transform: \"rotate(30deg)\"")}
    }} />)}
    </div>;
};
const BenefitsSection = () => {
  const { t } = useLang();
  return <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div>
            <motion.div initial={{
            {t("opacity: 0,")}
            y: 20
          }} whileInView={{
            {t("opacity: 1,")}
            y: 0
          }} viewport={{
            {t("once: true")}
          }} className="inline-block px-6 py-2 bg-[#F6F8F7] border border-[#E8E8E8] rounded-[100px] mb-2">
              <p className="text-[12px] font-medium text-[#1F2420]">
                {t("// Benefits //")}
              </p>
            </motion.div>
            <motion.h2 initial={{
            {t("opacity: 0,")}
            y: 20
          }} whileInView={{
            {t("opacity: 1,")}
            y: 0
          }} viewport={{
            {t("once: true")}
          }} transition={{
            {t("delay: 0.1")}
          }} className="text-2xl md:text-3xl lg:text-[40px] font-medium text-foreground leading-tight">
              {t("Why founders choose us")}{" "}
              <br />
              {t("to open in Florida")}
            </motion.h2>
          </div>
        <motion.div initial={{
          {t("opacity: 0,")}
          y: 20
        }} whileInView={{
          {t("opacity: 1,")}
          y: 0
        }} viewport={{
          {t("once: true")}
        }} transition={{
          {t("delay: 0.2")}
        }} className="flex items-end justify-start lg:justify-end">
            <p className="text-base font-light text-muted-foreground max-w-lg">
              {t("We handle the paperwork, filings and deadlines so you can focus on running your business — whether you live in Miami or Madrid.")}
            </p>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-[#F7F8F7] p-2 rounded-[24px]">
          {benefits.map((benefit, index) => <motion.div key={index} initial={{
          {t("opacity: 0,")}
          y: 30
        }} whileInView={{
          {t("opacity: 1,")}
          y: 0
        }} viewport={{
          {t("once: true")}
        }} transition={{
          {t("delay: index * 0.05")}
        }} className="bg-background rounded-[20px] pt-5 px-5 pb-10 hover:shadow-lg transition-all" style={{
          {t("boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.1), 0px 1px 4px rgba(12, 12, 13, 0.05)'")}
        }}>
              <ProgressIndicator filled={benefit.filled} />
              <h3 className="text-[18px] font-semibold text-foreground mb-2 leading-tight">
                {t(benefit.title)}
              </h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                {t(benefit.description)}
              </p>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default BenefitsSection;