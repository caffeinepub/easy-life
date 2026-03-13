import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, RefreshCw, XCircle } from "lucide-react";
import { motion } from "motion/react";

export default function PaymentFailurePage() {
  const navigate = useNavigate();
  return (
    <main className="container max-w-lg mx-auto px-4 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 mb-8">
          <XCircle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="font-display text-4xl font-semibold mb-3">
          Payment Failed
        </h1>
        <p className="text-muted-foreground mb-8">
          Something went wrong with your payment. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => navigate({ to: "/checkout" })}
            size="lg"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/" })}
            size="lg"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
