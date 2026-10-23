import { motion } from "framer-motion";
const benefits = [{
  title: "Optimized AI Costs",
  description: "Control and predict AI spending with centralized management and usage insights.",
  filled: 1
}, {
  title: "Accelerated AI Deployment",
  description: "Move AI solutions from pilot to production faster with standardized, enterprise-ready infrastructure.",
  filled: 2
}, {
  title: "Reduced Compliance Risk",
  description: "Protect enterprise data with built-in security, governance, and auditability across all AI usage.",
  filled: 4
}, {
  title: "Centralized Governance",
  description: "Monitor AI usage, performance, and cost across teams from a single control layer.",
  filled: 4
}, {
  title: "Scalable Adoption Across Teams",
  description: "Enable secure AI usage across departments without creating silos or operational friction.",
  filled: 5
}, {
  title: "Executive-Level Confidence",
  description: "Provide leadership with transparency, accountability, and control over enterprise AI initiatives.",
  filled: 6
}];
const ProgressIndicator = ({
  filled
}: {
  filled: number;
}) => {
  return <div className="mb-6 flex items-start justify-end gap-[8px]">
      {Array.from({
      length: 6
    }).map((_, i) => <div key={i} className={`w-[12px] h-[26px] rounded-full ${i < filled ? "bg-[#FF7732]" : "border-2 border-[#FF7732]/40 bg-transparent"}`} style={{
      transform: "rotate(30deg)"
    }} />)}
    </div>;
};
const BenefitsSection = () => {
  return <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div>
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="inline-block px-6 py-2 bg-[#F6F8F7] border border-[#E8E8E8] rounded-[100px] mb-2">
              <p className="text-[12px] font-medium text-[#1F2420]">
                // Benefits //
              </p>
            </motion.div>
            <motion.h2 initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.1
          }} className="text-2xl md:text-3xl lg:text-[40px] font-medium text-foreground leading-tight">
              Measurable business value{" "}
              <br />
              from enterprise AI
            </motion.h2>
          </div>
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.2
        }} className="flex items-end justify-start lg:justify-end">
            <p className="text-base font-light text-muted-foreground max-w-lg">
              AxiomAI helps organizations move from fragmented AI initiatives to a governed, scalable 
              AI capability — delivering operational efficiency, reduced risk, and faster time to value 
              across the enterprise.
            </p>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-[#F7F8F7] p-2 rounded-[24px]">
          {benefits.map((benefit, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.05
        }} className="bg-background rounded-[20px] pt-5 px-5 pb-10 hover:shadow-lg transition-all" style={{
          boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.1), 0px 1px 4px rgba(12, 12, 13, 0.05)'
        }}>
              <ProgressIndicator filled={benefit.filled} />
              <h3 className="text-[18px] font-semibold text-foreground mb-2 leading-tight">
                {benefit.title}
              </h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default BenefitsSection;