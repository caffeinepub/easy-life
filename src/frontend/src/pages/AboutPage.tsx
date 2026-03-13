import { Heart, Package, Shield, Star } from "lucide-react";
import { motion } from "motion/react";

export default function AboutPage() {
  const values = [
    {
      icon: Star,
      title: "Quality First",
      description:
        "Every product is carefully curated to meet our high standards of durability and style.",
    },
    {
      icon: Heart,
      title: "Customer Care",
      description:
        "Your comfort and satisfaction are our top priority — always.",
    },
    {
      icon: Package,
      title: "Doorstep Delivery",
      description:
        "We bring high-quality essentials right to your home, effortlessly.",
    },
    {
      icon: Shield,
      title: "Trusted & Reliable",
      description:
        "Shop with confidence knowing every order is handled with care.",
    },
  ];

  return (
    <main data-ocid="about.page">
      {/* Hero section */}
      <section
        data-ocid="about.section"
        className="relative overflow-hidden bg-foreground text-background py-24 px-4"
      >
        <div className="absolute inset-0 hero-grain pointer-events-none" />
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
          style={{
            background: "oklch(72 0.14 75)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-5"
          style={{
            background: "oklch(33 0.11 155)",
            transform: "translate(-40%, 40%)",
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
              Our Story
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-background/95 leading-tight mb-6">
              Welcome to Easy Life
            </h1>
            <p className="text-lg md:text-xl text-background/70 leading-relaxed max-w-2xl">
              At Easy Life, our mission is to simplify your lifestyle by
              providing high-quality, essential products right at your doorstep.
              We believe that shopping should be effortless and enjoyable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission content */}
      <section className="py-20 px-4 bg-background">
        <div className="container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
              Every item in our store is carefully curated to ensure it meets
              our standards of quality, durability, and style. We work with
              trusted suppliers and brands to bring you products that genuinely
              improve everyday life.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Thank you for choosing Easy Life — where your comfort is our
              priority.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values grid */}
      <section className="py-20 px-4 bg-secondary/40">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Our Values
            </h2>
            <p className="text-muted-foreground">
              The principles that guide everything we do
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 flex gap-4"
              >
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(72 0.14 75 / 0.12)" }}
                >
                  <v.icon
                    className="h-5 w-5"
                    style={{ color: "oklch(55 0.14 75)" }}
                  />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    {v.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
