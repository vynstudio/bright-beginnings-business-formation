import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Photo from "@/components/Photo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LanguageContext";
import { PHONE } from "@/lib/contact";
import { usePageTitle } from "@/hooks/usePageTitle";

const makeContactSchema = (t: (text: string) => string) => z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: t("Name is required") })
    .max(100, { message: t("Name must be less than 100 characters") }),
  email: z
    .string()
    .trim()
    .email({ message: t("Please enter a valid email address") })
    .max(255, { message: t("Email must be less than 255 characters") }),
  subject: z
    .string()
    .trim()
    .min(1, { message: t("Subject is required") })
    .max(200, { message: t("Subject must be less than 200 characters") }),
  message: z
    .string()
    .trim()
    .min(10, { message: t("Message must be at least 10 characters") })
    .max(2000, { message: t("Message must be less than 2000 characters") }),
});

type ContactFormData = z.infer<ReturnType<typeof makeContactSchema>>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t, lang } = useLang();
  usePageTitle("Contact us");

  const form = useForm<ContactFormData>({
    resolver: zodResolver(makeContactSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Saved by the contact-message function, which also alerts us on Telegram.
    const { error } = await supabase.functions.invoke("contact-message", {
      body: { ...data, language: lang },
    });
    setIsSubmitting(false);

    if (error) {
      toast({
        title: t("Message not sent"),
        description: t("Something went wrong. Please try again or email us directly."),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t("Message sent!"),
      description: t("Thank you for contacting us. We'll get back to you soon."),
    });
    form.reset();
  };

  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-32 pb-12 md:pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("Get in Touch")}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t("Have questions about forming your Florida company? We'd love to hear from you. Send us a message and we'll respond as soon as possible.")}
            </p>
          </motion.div>
          <div className="max-w-6xl mx-auto mt-10 h-[220px] sm:h-[320px] overflow-hidden rounded-[24px]">
            <Photo name="woman-at-desk" priority sizes="(min-width: 1184px) 1152px, calc(100vw - 32px)" className="w-full h-full object-[center_25%]" />
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-8"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                {t("Send us a message")}
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Name")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("Your name")}
                              {...field}
                              className="bg-background"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Email")}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t("your@email.com")}
                              {...field}
                              className="bg-background"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Subject")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("What's this about?")}
                            {...field}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Message")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("Tell us more about your inquiry...")}
                            rows={6}
                            {...field}
                            className="bg-background resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      t("Sending...")
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t("Send Message")}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  {t("How we reply")}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {t("Send us a message with the form and we'll reply by email. We help in Spanish, English and Portuguese.")}
                </p>
                <a href={`tel:${PHONE.tel}`} className="mb-4 inline-flex items-center gap-2 text-lg font-medium text-foreground hover:text-accent">
                  <Phone className="w-5 h-5" aria-hidden />
                  <span><span className="sr-only">{t("Call us")}: </span>{PHONE.display}</span>
                </a>
                <p className="text-muted-foreground">
                  {t("Please don't include Social Security numbers, passport numbers or other sensitive documents in your message.")}
                </p>
              </div>

              <div className="bg-muted rounded-2xl p-6">
                <p className="text-muted-foreground text-sm">
                  {t("Operated by Diler Services, LLC. We are not a law firm and do not give legal or tax advice.")}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
