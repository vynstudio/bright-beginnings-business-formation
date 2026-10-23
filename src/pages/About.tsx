import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LogoStrip from "@/components/LogoStrip";
import { ColorsIcon, AiSecurity01Icon, Layers01Icon } from "hugeicons-react";
import heroRings from "@/assets/hero-rings.jpg";
import glassSphere from "@/assets/about-glass-sphere.jpg";
import commitmentImage from "@/assets/about-commitment.jpg";
const About = () => {
  const beliefs = [{
    icon: ColorsIcon,
    title: "Control over chaos",
    description: "Enterprises need centralized governance, not uncontrolled experimentation."
  }, {
    icon: AiSecurity01Icon,
    title: "Security is non-negotiable",
    description: "Data protection, compliance, and auditability must be built in — not added later."
  }, {
    icon: Layers01Icon,
    title: "Scale without friction",
    description: "AI should be accessible across teams while remaining consistent, compliant, and cost-efficient."
  }];
  const stats = [{
    value: "↓ 42%",
    label: "AI costs",
    description: "through centralized usage control and optimization"
  }, {
    value: "3×",
    label: "faster",
    description: "time to production from pilot to enterprise deployment"
  }, {
    value: "$1M+",
    label: "saved",
    description: "annually by enterprise customers through AI cost governance"
  }, {
    value: "24/7",
    label: "visibility",
    description: "into AI usage, performance, and cost"
  }];
  return <div className="min-h-dvh bg-background">
      <Header />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section className="pt-32 pb-12 md:pb-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }}>
                <span className="inline-block mb-6 text-sm text-muted-foreground bg-muted/50 border border-border rounded-full py-[4px] px-[12px] font-light">
                  About us
                </span>
                <h1 className="text-[32px] sm:text-[40px] md:text-[56px] font-medium text-foreground leading-[1.1] mb-6">
                  Our Mission
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                  Bringing AI from experiment to competitive edge. Our vision: empower every enterprise to unlock AI's full potential while prioritizing security and governance.
                </p>
              </motion.div>
              <motion.div initial={{
              opacity: 0,
              scale: 0.95
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }} className="relative">
                <img alt="3D Orange Rings" className="w-full rounded-3xl object-cover aspect-[4/3]" src="/lovable-uploads/5d758149-458c-4711-aee9-d704f3406698.png" />
              </motion.div>
            </div>

            {/* Logo Strip */}
            <div className="mt-16 overflow-hidden">
              <LogoStrip label="Trusted by global enterprises and industry leaders" />
            </div>
          </div>
        </section>

        {/* Mission Statement Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }} viewport={{
              once: true
            }}>
                <h2 className="text-[24px] sm:text-[32px] md:text-[40px] font-medium text-foreground leading-[1.2]">
                  We believe{" "}
                  <span className="text-orange-500">AI should accelerate innovation,</span>
                  {" "}not introduce risk, opacity, or fragmentation. AxiomAI exists to make enterprise AI secure, governed, and scalable by design.
                </h2>
              </motion.div>
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.1
            }} viewport={{
              once: true
            }} className="space-y-6">
                <div>
                  <p className="text-[16px] font-medium mb-4 text-foreground">
                    From experimentation to enterprise reality
                  </p>
                  <p className="text-muted-foreground leading-relaxed">Across industries, organizations struggle to move AI beyond isolated pilots. Teams adopt tools independently, governance lags behind, and leadership lacks visibility.


AxiomAI was created to solve this gap — to provide the missing control layer that turns scattered AI efforts into a coherent, enterprise-wide capability.</p>
                </div>
                
              </motion.div>
            </div>
          </div>
        </section>

        {/* What We Believe Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.6
            }} viewport={{
              once: true
            }} className="relative">
                <img alt="Glass Sphere" className="w-full rounded-3xl" src="/lovable-uploads/97137d00-d934-4f44-8da3-90d254cbb1d3.png" />
              </motion.div>
              <motion.div initial={{
              opacity: 0,
              x: 20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.6,
              delay: 0.1
            }} viewport={{
              once: true
            }} className="max-w-[600px]">
                <h3 className="text-[24px] sm:text-[28px] md:text-[36px] font-medium text-foreground mb-8">
                  What we believe
                </h3>
                <p className="text-muted-foreground mb-10 leading-relaxed">AxiomAI is built on several core principles that guide its development and functionality. These principles include adaptability, where the system learns and evolves based on user interactions, and transparency, ensuring that users understand how decisions are made.</p>
                <div className="bg-[#F7F8F7] rounded-[24px] p-2 flex flex-col gap-2">
                  {beliefs.map((belief, index) => <motion.div key={belief.title} initial={{
                  opacity: 0,
                  y: 10
                }} whileInView={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  duration: 0.4,
                  delay: index * 0.1
                }} viewport={{
                  once: true
                }} className="bg-background rounded-[16px] p-5" style={{
                  boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.1), 0px 1px 4px rgba(12, 12, 13, 0.05)'
                }}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#EFF1EF] rounded-xl flex items-center justify-center flex-shrink-0">
                          <belief.icon className="w-5 h-5 text-[#6B7280]" strokeWidth={1.5} />
                        </div>
                        <h4 className="text-[18px] font-medium text-foreground">{belief.title}</h4>
                      </div>
                      <p className="text-[15px] text-muted-foreground leading-relaxed">{belief.description}</p>
                    </motion.div>)}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
          <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }} className="max-w-[600px] mb-16">
              <h2 className="text-[24px] sm:text-[32px] md:text-[40px] font-medium text-foreground leading-[1.2] mb-4">
                We are committed to{" "}
                <span className="text-[#f97415]">helping enterprises adopt AI responsibly</span>
                {" "}— with clear standards, ethical use, and long-term sustainability.
              </h2>
              <p className="text-muted-foreground mt-6 max-w-[430px]">
                As more enterprises adopt AI, AxiomAI is helping them avoid the typical AI pitfalls by simplifying AI with confidence.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => <motion.div key={stat.label} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: index * 0.1
            }} viewport={{
              once: true
            }} className="bg-background rounded-2xl p-6 space-y-2" style={{
              boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.1), 0px 1px 4px rgba(12, 12, 13, 0.05)'
            }}>
                  <div className="text-[36px] md:text-[48px] font-medium text-foreground leading-none">
                    {stat.value} <span className="text-[20px] md:text-[24px] font-normal">{stat.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }} viewport={{
              once: true
            }}>
                <h3 className="text-[24px] sm:text-[28px] md:text-[36px] font-medium text-foreground mb-4">
                  Our commitment
                </h3>
                <p className="text-[16px] font-medium mb-6 text-foreground">
                  Responsible AI at enterprise scale
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We are committed to helping enterprises adopt AI responsibly — with clear standards, ethical use, and long-term sustainability.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  As more enterprises adopt AI, AxiomAI is helping them avoid the typical AI pitfalls by simplifying AI with confidence.
                </p>
              </motion.div>
              <motion.div initial={{
              opacity: 0,
              scale: 0.95
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }} viewport={{
              once: true
            }} className="relative">
                <img alt="Abstract 3D Shape" className="w-full rounded-3xl object-cover aspect-square" src="/lovable-uploads/11793a48-92cb-46ff-90f3-16b017c43dbf.png" />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default About;