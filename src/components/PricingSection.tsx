import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const starterFeatures = ["Access to core AI models", "Up to 5 team members", "Basic compliance tools", "Community support", "Standard integrations"];
  const coreFeatures = ["Access to all AI model integrations", "Full team management", "Compliance and monitoring controls", "Standard cross-organization support", "Email and dedicated support"];
  const customFeatures = ["Everything in Enterprise Core, plus SSO/SAML", "Custom models and VPC or on-prem deployment", "Advanced security (PII on content filtering)", "Volume discounts and unlimited teams", "Dedicated support with live chat"];
  
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:max-w-xl"
          >
            {/* Badge */}
            <div className="inline-block px-6 py-2 bg-[#F6F8F7] border border-[#E8E8E8] rounded-[100px] mb-4">
              <p className="text-[12px] font-medium text-[#1F2420]">// Pricing //</p>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-[40px] font-medium text-foreground leading-tight">
              Enterprise pricing, tailored to your needs
            </h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground lg:max-w-xs lg:text-right lg:pt-12"
          >
            Choose the right plan for the pace and complexity of your organization.
          </motion.p>
        </div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-1 bg-background border border-border rounded-full p-1">
            <button
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                !isAnnual ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
            <button
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                isAnnual ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Yearly
              <span className="text-[11px] font-semibold text-[#FF520A]">20% off</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#F7F8F7] rounded-[20px] p-2 flex flex-col"
          >
            {/* Title Card */}
            <div 
              className="bg-white rounded-[16px] p-5 mb-2"
              style={{
                boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.1), 0px 1px 4px rgba(12, 12, 13, 0.05)'
              }}
            >
              <h3 className="text-lg font-medium text-foreground mb-4">Starter</h3>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-foreground">
                  ${isAnnual ? "199" : "249"}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <Button asChild variant="outline" className="w-full rounded-full">
                <Link to="/contact">GET STARTED</Link>
              </Button>
            </div>

            {/* Features */}
            <ul className="space-y-3 px-3 py-4 flex-1">
              {starterFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FF520A' }} />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Core Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#F7F8F7] rounded-[20px] p-2 flex flex-col"
          >
            {/* Title Card */}
            <div 
              className="bg-white rounded-[16px] p-5 mb-2"
              style={{
                boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.1), 0px 1px 4px rgba(12, 12, 13, 0.05)'
              }}
            >
              <h3 className="text-lg font-medium text-foreground mb-4">Enterprise Core</h3>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-foreground">
                  ${isAnnual ? "499" : "599"}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <Button asChild variant="lime" className="w-full rounded-full">
                <Link to="/contact">TALK TO SALES</Link>
              </Button>
            </div>

            {/* Features */}
            <ul className="space-y-3 px-3 py-4 flex-1">
              {coreFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FF520A' }} />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Custom Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#1F2420] rounded-[20px] p-2 flex flex-col"
          >
            {/* Title Card */}
            <div 
              className="bg-[#2A2F2B] rounded-[16px] p-5 mb-2"
              style={{
                boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.3), 0px 1px 4px rgba(0, 0, 0, 0.2)'
              }}
            >
              <h3 className="text-lg font-medium text-white mb-4">Custom</h3>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>

              <Button asChild variant="heroOutline" className="w-full bg-white text-foreground hover:bg-white/90 rounded-full py-2 pr-[2px] pl-6 relative justify-center">
                <Link to="/contact">
                  TALK TO SALES
                  <span className="bg-foreground rounded-full p-2 absolute right-2">
                    <ArrowUpRight size={18} className="text-background" />
                  </span>
                </Link>
              </Button>
            </div>

            {/* Features */}
            <ul className="space-y-3 px-3 py-4 flex-1">
              {customFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FF520A' }} />
                  <span className="text-white/90">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default PricingSection;