import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const { state, dispatch, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    dispatch({ type: "CLOSE_CART" });
    navigate({ to: "/checkout" });
  };

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => dispatch({ type: "CLOSE_CART" })}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background shadow-float z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display text-lg font-semibold">
                Your Cart{" "}
                {totalItems > 0 && (
                  <span className="text-muted-foreground text-sm font-body font-normal">
                    ({totalItems} items)
                  </span>
                )}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch({ type: "CLOSE_CART" })}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Items */}
            {state.items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
                <p className="font-display text-xl text-muted-foreground">
                  Your cart is empty
                </p>
                <p className="text-sm text-muted-foreground">
                  Add some products to get started
                </p>
                <Button
                  onClick={() => {
                    dispatch({ type: "CLOSE_CART" });
                    navigate({ to: "/products" });
                  }}
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-4">
                  {state.items.map((item, idx) => (
                    <div
                      key={item.product.id}
                      data-ocid={`cart.item.${idx + 1}`}
                      className="flex gap-3 animate-fade-up"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg bg-secondary flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.product.category}
                        </p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          ${item.product.price.toFixed(2)}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              dispatch({
                                type: "UPDATE_QUANTITY",
                                productId: item.product.id,
                                quantity: item.quantity - 1,
                              })
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              dispatch({
                                type: "UPDATE_QUANTITY",
                                productId: item.product.id,
                                quantity: item.quantity + 1,
                              })
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            data-ocid={`cart.delete_button.${idx + 1}`}
                            className="h-7 w-7 ml-auto text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              dispatch({
                                type: "REMOVE_ITEM",
                                productId: item.product.id,
                              })
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="px-6 py-4 border-t border-border space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-primary font-medium">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full h-12 text-base"
                  data-ocid="cart.checkout_button"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground"
                  onClick={() => dispatch({ type: "CLEAR_CART" })}
                >
                  Clear cart
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
