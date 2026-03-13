import { Link } from "@tanstack/react-router";
import { CalendarDays, CreditCard, PackageCheck } from "lucide-react";
import { motion } from "motion/react";

export default function RefundPolicyPage() {
  const policies = [
    {
      icon: CalendarDays,
      title: "Return Window",
      badge: "7 Days",
      description:
        "You can return any item within 7 days of delivery. Simply initiate a return request through your account or by contacting our support team.",
    },
    {
      icon: PackageCheck,
      title: "Item Condition",
      badge: "Original Packaging",
      description:
        "Items must be unused, in their original packaging, and with all tags attached. Items showing signs of use or missing original packaging may not qualify.",
    },
    {
      icon: CreditCard,
      title: "Refunds",
      badge: "5–7 Business Days",
      description:
        "Once we receive and inspect your return, your refund will be processed to your original payment method within 5–7 business days.",
    },
  ];

  return (
    <main data-ocid="refund.page">
      {/* Hero */}
      <section
        data-ocid="refund.section"
        className="relative overflow-hidden bg-foreground text-background py-24 px-4"
      >
        <div className="absolute inset-0 hero-grain pointer-events-none" />
        <div
          className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-5"
          style={{
            background: "oklch(72 0.14 75)",
            transform: "translate(-30%, -30%)",
          }}
        />
        <div className="container max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: "oklch(72 0.14 75)" }}
            >
              Policies
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-background/95 leading-tight mb-6">
              Hassle-Free Returns
            </h1>
            <p className="text-lg md:text-xl text-background/70 leading-relaxed">
              We want you to love what you buy! If you are not completely
              satisfied with your purchase, we are here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policy cards */}
      <section className="py-20 px-4 bg-background">
        <div className="container max-w-3xl mx-auto">
          <div className="flex flex-col gap-6">
            {policies.map((policy, i) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-5 bg-card border border-border rounded-xl p-6 md:p-8"
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mt-1"
                  style={{ background: "oklch(72 0.14 75 / 0.12)" }}
                >
                  <policy.icon
                    className="h-6 w-6"
                    style={{ color: "oklch(55 0.14 75)" }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      {policy.title}
                    </h2>
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{
                        background: "oklch(72 0.14 75 / 0.15)",
                        color: "oklch(42 0.14 75)",
                      }}
                    >
                      {policy.badge}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {policy.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mt-12 p-8 rounded-2xl text-center"
            style={{
              background: "oklch(33 0.11 155 / 0.06)",
              border: "1px solid oklch(33 0.11 155 / 0.15)",
            }}
          >
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              Need help with a return?
            </h3>
            <p className="text-muted-foreground mb-5">
              Our support team is ready to assist you through every step of the
              process.
            </p>
            <Link
              to="/account"
              data-ocid="refund.primary_button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
              style={{
                background: "oklch(33 0.11 155)",
                color: "oklch(97.5 0.008 85)",
              }}
            >
              Go to My Account
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
