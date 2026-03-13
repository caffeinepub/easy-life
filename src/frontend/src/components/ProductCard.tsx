import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import type { Product } from "../data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { format } = useCurrency();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      description: format(product.price),
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group bg-card rounded-xl overflow-hidden border border-border shadow-xs hover:shadow-product transition-shadow cursor-pointer"
      onClick={() =>
        navigate({
          to: "/products/$productId",
          params: { productId: product.id },
        })
      }
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.featured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs">
            Featured
          </Badge>
        )}
        {product.stock <= 5 && (
          <Badge
            variant="destructive"
            className="absolute top-3 right-3 text-xs"
          >
            Low Stock
          </Badge>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <h3 className="font-display font-semibold text-base leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg text-foreground">
            {format(product.price)}
          </span>
          <Button
            size="sm"
            data-ocid="product.add_button"
            onClick={handleAddToCart}
            className="gap-1.5"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
