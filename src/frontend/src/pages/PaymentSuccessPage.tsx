import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  return (
    <main className="container max-w-lg mx-auto px-4 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-display text-4xl font-semibold mb-3">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground mb-8">
          Your order has been confirmed and will ship soon.
        </p>
        <Button
          onClick={() => navigate({ to: "/" })}
          size="lg"
          className="gap-2"
        >
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </main>
  );
}
