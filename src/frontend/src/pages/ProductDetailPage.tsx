import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Package, Shield, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { PRODUCTS } from "../data/products";

const STARS = [0, 1, 2, 3, 4];

export default function ProductDetailPage() {
  const { productId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const [quantity, setQuantity] = useState(1);

  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return (
      <main className="container max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl mb-4">Product not found</h1>
        <Button onClick={() => navigate({ to: "/products" })}>
          Back to Shop
        </Button>
      </main>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(
      `${quantity > 1 ? `${quantity}x ` : ""}${product.name} added to cart!`,
    );
  };

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 3);

  return (
    <main className="container max-w-7xl mx-auto px-4 py-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: "/products" })}
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Shop
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="aspect-square rounded-2xl overflow-hidden bg-secondary"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col justify-center"
        >
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{product.category}</Badge>
            {product.featured && (
              <Badge className="bg-primary text-primary-foreground">
                Featured
              </Badge>
            )}
            {product.stock <= 5 && (
              <Badge variant="destructive">Only {product.stock} left</Badge>
            )}
          </div>

          <h1 className="font-display text-4xl font-semibold leading-tight mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {STARS.map((s) => (
                <span
                  key={s}
                  className={
                    s < Math.floor(product.rating)
                      ? "text-amber-400"
                      : "text-muted-foreground/30"
                  }
                >
                  &#9733;
                </span>
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <p className="text-3xl font-semibold mb-6">{format(product.price)}</p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>

          <Separator className="mb-6" />

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Qty</Label>
              <Input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(
                      1,
                      Math.min(product.stock, Number(e.target.value)),
                    ),
                  )
                }
                data-ocid="product.quantity_input"
                className="w-20 text-center"
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {product.stock} in stock
            </span>
          </div>

          <Button
            size="lg"
            className="h-12 gap-2 text-base w-full sm:w-auto"
            data-ocid="product.add_button"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5" /> Add to Cart
          </Button>

          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" /> Free shipping over ₹4,000
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" /> 30-day returns
            </div>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold mb-6">
            You might also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
