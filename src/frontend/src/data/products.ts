export type Category = "Electronics" | "Clothing" | "Home & Garden";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
  featured: boolean;
  rating: number;
  reviewCount: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones Pro",
    description:
      "Immersive 40mm drivers with active noise cancellation and 30-hour battery life. Foldable design with premium memory foam ear cushions for all-day comfort. Bluetooth 5.3 with multi-device pairing.",
    price: 79.99,
    category: "Electronics",
    image: "/assets/generated/product-headphones.dim_600x600.jpg",
    stock: 24,
    featured: true,
    rating: 4.7,
    reviewCount: 312,
  },
  {
    id: "2",
    name: "Smart Watch Series X",
    description:
      "Comprehensive health tracking with ECG, SpO2, and advanced sleep analysis. Always-on AMOLED display with sapphire crystal glass. GPS, 5ATM water resistance, and 7-day battery life.",
    price: 149.99,
    category: "Electronics",
    image: "/assets/generated/product-smartwatch.dim_600x600.jpg",
    stock: 15,
    featured: true,
    rating: 4.9,
    reviewCount: 528,
  },
  {
    id: "3",
    name: "Bluetooth Speaker Mini",
    description:
      "360-degree room-filling sound in a compact cylindrical design. IPX7 waterproof rating perfect for outdoor adventures. 20-hour playtime with USB-C fast charging.",
    price: 49.99,
    category: "Electronics",
    image: "/assets/generated/product-speaker.dim_600x600.jpg",
    stock: 40,
    featured: false,
    rating: 4.5,
    reviewCount: 189,
  },
  {
    id: "4",
    name: "Classic Essential T-Shirt",
    description:
      "Crafted from 100% organic Pima cotton, this essential tee features a relaxed fit with reinforced stitching. Pre-shrunk fabric, enzyme washed for exceptional softness. Available in 12 colorways.",
    price: 24.99,
    category: "Clothing",
    image: "/assets/generated/product-tshirt.dim_600x600.jpg",
    stock: 87,
    featured: true,
    rating: 4.6,
    reviewCount: 743,
  },
  {
    id: "5",
    name: "Heritage Denim Jacket",
    description:
      "Sanforized selvedge denim in a classic trucker silhouette. 14oz Japanese denim with natural indigo dye. Brass hardware, double-needle stitching, and a comfortable broken-in feel from day one.",
    price: 89.99,
    category: "Clothing",
    image: "/assets/generated/product-jacket.dim_600x600.jpg",
    stock: 18,
    featured: false,
    rating: 4.8,
    reviewCount: 256,
  },
  {
    id: "6",
    name: "Cedar & Amber Candle",
    description:
      "Hand-poured soy wax candle with a sophisticated blend of aged cedar, warm amber, and a hint of black pepper. 60-hour burn time. Comes in a reusable amber glass vessel with a wooden lid.",
    price: 18.99,
    category: "Home & Garden",
    image: "/assets/generated/product-candle.dim_600x600.jpg",
    stock: 62,
    featured: true,
    rating: 4.9,
    reviewCount: 418,
  },
  {
    id: "7",
    name: "Matte Pour-Over Coffee Maker",
    description:
      "Precision-engineered borosilicate glass pour-over with a matte black stainless steel filter. Brews 600ml of exceptional clarity coffee. Dishwasher safe with a heat-resistant silicone handle.",
    price: 64.99,
    category: "Home & Garden",
    image: "/assets/generated/product-coffeemaker.dim_600x600.jpg",
    stock: 31,
    featured: true,
    rating: 4.7,
    reviewCount: 295,
  },
];

export const CATEGORIES: Category[] = [
  "Electronics",
  "Clothing",
  "Home & Garden",
];
