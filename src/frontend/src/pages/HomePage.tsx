import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, RotateCcw, Shield, Sparkles, Truck } from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { CATEGORIES, PRODUCTS } from "../data/products";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 24 } as Record<
      string,
      unknown
    >,
  },
};

export default function HomePage() {
  const navigate = useNavigate();
  const featured = PRODUCTS.filter((p) => p.featured);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="relative h-[520px] md:h-[620px] flex items-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(33 0.11 155) 0%, oklch(22 0.08 155) 60%, oklch(18 0.04 60) 100%)",
          }}
        >
          <img
            src="/assets/generated/hero-banner.dim_1600x700.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
          />
          <div
            className="absolute right-0 top-0 w-96 h-96 rounded-full opacity-10"
            style={{
              background: "oklch(72 0.14 75)",
              filter: "blur(80px)",
              transform: "translate(30%, -30%)",
            }}
          />
          <div
            className="absolute left-0 bottom-0 w-64 h-64 rounded-full opacity-10"
            style={{
              background: "oklch(72 0.14 75)",
              filter: "blur(60px)",
              transform: "translate(-30%, 30%)",
            }}
          />

          <div className="container max-w-7xl mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <Badge
                className="mb-4 text-xs font-body font-medium"
                style={{
                  background: "oklch(72 0.14 75 / 0.2)",
                  color: "oklch(72 0.14 75)",
                  border: "1px solid oklch(72 0.14 75 / 0.3)",
                }}
              >
                <Sparkles className="h-3 w-3 mr-1" /> New arrivals this week
              </Badge>
              <h1 className="font-display text-5xl md:text-7xl font-semibold text-white leading-[1.05] mb-6">
                Life&apos;s better
                <br />
                <span style={{ color: "oklch(72 0.14 75)" }}>made easy.</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-md">
                Curated premium products for every corner of your life &mdash;
                electronics, fashion, and home essentials.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base gap-2"
                  style={{
                    background: "oklch(72 0.14 75)",
                    color: "oklch(18 0.025 60)",
                  }}
                  onClick={() => navigate({ to: "/products" })}
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base border-white/30 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => navigate({ to: "/products" })}
                >
                  Browse All
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="border-b border-border bg-secondary/40">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                text: "On orders over $50",
              },
              {
                icon: Shield,
                title: "Secure Payments",
                text: "Powered by Stripe",
              },
              {
                icon: RotateCcw,
                title: "Easy Returns",
                text: "30-day return policy",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-center gap-3 py-4 px-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              Handpicked for you
            </p>
            <h2 className="font-display text-4xl font-semibold">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {featured.map((product) => (
            <motion.div key={product.id} variants={item}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Shop by Category */}
      <section className="container max-w-7xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            Explore
          </p>
          <h2 className="font-display text-4xl font-semibold">
            Shop by Category
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => {
            const catProducts = PRODUCTS.filter((p) => p.category === cat);
            const colors = [
              "from-emerald-900 to-emerald-700",
              "from-slate-800 to-slate-600",
              "from-amber-900 to-amber-700",
            ];
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors[i]} p-8 cursor-pointer group`}
                onClick={() => navigate({ to: "/products" })}
              >
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <img
                    src={catProducts[0]?.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <Badge className="mb-3 bg-white/20 text-white border-0 text-xs">
                    {catProducts.length} items
                  </Badge>
                  <h3 className="font-display text-2xl font-semibold text-white mb-2">
                    {cat}
                  </h3>
                  <p className="text-white/70 text-sm mb-4">
                    {cat === "Electronics" &&
                      "Cutting-edge tech for modern living"}
                    {cat === "Clothing" && "Premium fabrics, timeless styles"}
                    {cat === "Home & Garden" &&
                      "Elevate every room in your home"}
                  </p>
                  <span className="text-sm font-medium text-white/80 group-hover:text-white flex items-center gap-1 transition-colors">
                    Shop now{" "}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
