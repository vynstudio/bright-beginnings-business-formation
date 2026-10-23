import { motion } from "framer-motion";
import { Star } from "lucide-react";
import testimonialAvatar from "@/assets/testimonial-avatar.webp";

const testimonials = [
  {
    quote: "The missing layer for enterprise AI.",
    description: "AxiomAI gave us centralized governance without slowing innovation.",
    author: "VP of Technology",
    company: "Global Financial Services Company",
    rating: 5,
  },
  {
    quote: "Built for real enterprise constraints.",
    description: "Security, compliance, and scale were clearly first-class priorities.",
    author: "Director of AI",
    company: "Healthcare Enterprise",
    rating: 5,
  },
  {
    quote: "Collaboration finally works.",
    description: "AxiomAI enabled teams across departments to share models and insights seamlessly.",
    author: "Director of Data Science",
    company: "Technology Services Company",
    rating: 5,
  },
  {
    quote: "Transformed our AI operations.",
    description: "We reduced deployment time by 80% while maintaining full compliance.",
    author: "CTO",
    company: "Fortune 500 Retailer",
    rating: 5,
  },
  {
    quote: "Enterprise-grade from day one.",
    description: "Finally a platform that understands the complexities of regulated industries.",
    author: "Head of Innovation",
    company: "Insurance Corporation",
    rating: 5,
  },
  {
    quote: "Seamless integration experience.",
    description: "AxiomAI connected with our existing infrastructure without any friction.",
    author: "VP Engineering",
    company: "Manufacturing Leader",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
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
            "AxiomAI is by far the best enterprise AI platform I have ever used"
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
              <p className="text-base font-medium text-foreground">Aurora Greenwich</p>
              <p className="text-sm text-muted-foreground">VP Marketing, Tesla</p>
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
                duration: 30,
                repeat: Infinity,
                ease: "linear",
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
                    boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.1), 0px 1px 4px rgba(12, 12, 13, 0.05)'
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
                    "{testimonial.quote}"
                  </h3>

                  {/* Description */}
                  <p className="text-[15px] text-[#6B7280] leading-relaxed">
                    {testimonial.description}
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
