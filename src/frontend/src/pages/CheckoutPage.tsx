import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CreditCard, Loader2, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { state, totalPrice, dispatch } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  if (state.items.length === 0) {
    return (
      <main className="container max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl mb-4">Your cart is empty</h1>
        <Button onClick={() => navigate({ to: "/products" })}>
          Continue Shopping
        </Button>
      </main>
    );
  }

  const shipping = totalPrice >= 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const total = totalPrice + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.cardNumber) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2200));
    setIsProcessing(false);
    dispatch({ type: "CLEAR_CART" });
    navigate({ to: "/order-confirmation" });
  };

  return (
    <main className="container max-w-7xl mx-auto px-4 py-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: "/products" })}
        className="mb-6 gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Continue Shopping
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Form */}
        <div className="lg:col-span-3">
          <h1 className="font-display text-3xl font-semibold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Jane Smith"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="jane@example.com"
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="123 Main Street"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      placeholder="New York"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={form.zip}
                      onChange={(e) =>
                        setForm({ ...form, zip: e.target.value })
                      }
                      placeholder="10001"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Payment Details
                  <Lock className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    value={form.cardNumber}
                    onChange={(e) =>
                      setForm({ ...form, cardNumber: e.target.value })
                    }
                    placeholder="4242 4242 4242 4242"
                    required
                    className="mt-1 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      value={form.expiry}
                      onChange={(e) =>
                        setForm({ ...form, expiry: e.target.value })
                      }
                      placeholder="MM/YY"
                      className="mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      value={form.cvc}
                      onChange={(e) =>
                        setForm({ ...form, cvc: e.target.value })
                      }
                      placeholder="123"
                      className="mt-1 font-mono"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {isProcessing && (
              <motion.div
                data-ocid="checkout.loading_state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20"
              >
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <p className="text-sm font-medium text-primary">
                  Processing your payment securely...
                </p>
              </motion.div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 text-base gap-2"
              data-ocid="checkout.submit_button"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Pay ${total.toFixed(2)}
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-lg object-cover bg-secondary flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-primary font-medium">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
