import { motion } from "framer-motion";
import { ColorsIcon, AiSecurity01Icon, Layers01Icon } from "hugeicons-react";
import looper1 from "@/assets/looper-1.svg";
import looper2 from "@/assets/looper-2.png";
import looper3 from "@/assets/looper-3.png";
const features = [{
  icon: ColorsIcon,
  title: "AI model orchestration",
  description: "Deploy, manage, and route multiple AI models across use cases and teams.",
  meshType: "spiral"
}, {
  icon: AiSecurity01Icon,
  title: "Security and compliance built in",
  description: "SOC 2, ISO 27001 ready. Data isolation, audit logs, and role-based access control.",
  meshType: "wave"
}, {
  icon: Layers01Icon,
  title: "Enterprise integrations",
  description: "Integrate AI directly into existing enterprise systems and processes.",
  meshType: "flow"
}];

// Decorative mesh SVG components
const SpiralMesh = () => <img src={looper1} alt="" className="w-full h-full object-cover" />;
const WaveMesh = () => <img src={looper2} alt="" className="w-full h-full object-cover" />;
const FlowMesh = () => <img src={looper3} alt="" className="w-full h-full object-cover" />;
const meshComponents = {
  spiral: SpiralMesh,
  wave: WaveMesh,
  flow: FlowMesh
};
const FeaturesSection = () => {
  return <section id="about" className="py-12 md:py-20 bg-background">
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
                // Key Features //
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
              Built for control.{" "}
              <br />
              Designed to scale
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
            <p className="text-[#59605A] max-w-lg">
              Gain full control over how AI is deployed, accessed, and used across your organization. 
              Standardize AI workflows, enforce security and compliance policies, and scale adoption 
              confidently without sacrificing transparency or performance.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((feature, index) => {
          const MeshComponent = meshComponents[feature.meshType as keyof typeof meshComponents];
          return <motion.div key={index} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="bg-[#F6F8F7] border-[#E8E8E8] rounded-2xl overflow-hidden flex flex-col border-0">
                <div className="m-2 p-5 bg-[#FFFFFF] rounded-xl shadow-[0_1px_4px_rgba(12,12,13,0.1),0_1px_4px_rgba(12,12,13,0.05)] flex flex-col gap-2 relative z-10">
                  <div className="w-12 h-12 bg-[#EFF1EF] rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-[#6B7280]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1F2420]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="h-40 -mt-2 overflow-hidden">
                  <MeshComponent />
                </div>
              </motion.div>;
        })}
        </div>
      </div>
    </section>;
};
export default FeaturesSection;