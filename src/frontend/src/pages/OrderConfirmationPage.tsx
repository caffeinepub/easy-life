import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Package } from "lucide-react";
import { motion } from "motion/react";

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const orderNumber = `EL-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <main className="container max-w-2xl mx-auto px-4 py-20">
      <motion.div
        data-ocid="checkout.success_state"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8"
        >
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </motion.div>

        <h1 className="font-display text-4xl font-semibold mb-3">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground text-lg mb-2">
          Thank you for shopping with Easy Life.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Order #{orderNumber}
        </p>

        <Card className="mb-8 text-left">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Estimated Delivery</p>
                <p className="text-sm text-muted-foreground">
                  3–5 business days
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent. Your order is being processed
              and will ship soon.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate({ to: "/products" })}
            size="lg"
            className="gap-2"
          >
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/account" })}
            size="lg"
          >
            View Account
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
