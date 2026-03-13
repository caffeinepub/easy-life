import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearch } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { CATEGORIES, type Category, PRODUCTS } from "../data/products";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 24 } as Record<
      string,
      unknown
    >,
  },
};

export default function ProductsPage() {
  const search = useSearch({ strict: false }) as { category?: string };
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "All">(
    (search.category as Category) ?? "All",
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesQuery =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesQuery && matchesCategory && matchesPrice;
    });
  }, [query, activeCategory, priceRange]);

  return (
    <main className="container max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
          Discover
        </p>
        <h1 className="font-display text-4xl font-semibold">All Products</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-ocid="products.search_input"
            className="pl-9 h-10"
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="sm:hidden gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div>
                <Label className="text-sm font-semibold mb-3 block">
                  Price Range
                </Label>
                <Slider
                  min={0}
                  max={200}
                  step={5}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange(v as [number, number])}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden sm:flex items-center gap-3 bg-secondary/50 rounded-lg px-4 py-2 min-w-[260px]">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Price: ${priceRange[0]}&ndash;${priceRange[1]}
          </span>
          <Slider
            min={0}
            max={200}
            step={5}
            value={priceRange}
            onValueChange={(v) => setPriceRange(v as [number, number])}
            className="flex-1"
          />
        </div>
      </div>

      <Tabs
        value={activeCategory}
        onValueChange={(v) => setActiveCategory(v as Category | "All")}
        className="mb-8"
      >
        <TabsList className="bg-secondary">
          <TabsTrigger value="All" data-ocid="products.category_filter.tab">
            All
          </TabsTrigger>
          {CATEGORIES.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              data-ocid="products.category_filter.tab"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" && (
            <>
              {" "}
              in{" "}
              <Badge variant="secondary" className="ml-1">
                {activeCategory}
              </Badge>
            </>
          )}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div data-ocid="products.empty_state" className="text-center py-24">
          <p className="font-display text-2xl text-muted-foreground mb-2">
            No products found
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <motion.div
          key={`${activeCategory}-${query}`}
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filtered.map((product) => (
            <motion.div key={product.id} variants={item}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
}
