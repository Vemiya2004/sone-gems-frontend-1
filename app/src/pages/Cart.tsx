import React from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart();
  const [, setLocation] = useLocation();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Discover our collection of rare and precious Sri Lankan gemstones to add to your collection.
        </p>
        <Button asChild size="lg" className="px-8">
          <Link href="/gems">Explore Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-4xl font-bold mb-10">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="hidden md:grid grid-cols-12 text-sm font-medium text-muted-foreground border-b border-border pb-4">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.map((item) => (
              <div key={item.gemId} className="flex flex-col md:grid md:grid-cols-12 items-center gap-4 py-6 border-b border-border/50">
                <div className="col-span-6 w-full flex items-center gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-muted rounded-sm overflow-hidden shrink-0 border border-border">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link href={`/gems/${item.gemId}`} className="font-serif text-lg font-medium hover:text-primary transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <button 
                      onClick={() => removeItem(item.gemId)}
                      className="text-sm text-destructive hover:underline mt-2 flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>

                <div className="col-span-2 w-full md:w-auto flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-muted-foreground text-sm">Price:</span>
                  <span className="font-medium">{formatCurrency(item.price)}</span>
                </div>

                <div className="col-span-2 w-full md:w-auto flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-muted-foreground text-sm">Quantity:</span>
                  <div className="flex items-center border border-input rounded-sm">
                    <button 
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                      onClick={() => updateQuantity(item.gemId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <div className="w-8 text-center text-sm font-medium">{item.quantity}</div>
                    <button 
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => updateQuantity(item.gemId, item.quantity + 1)}
                      disabled={item.stock !== undefined && item.quantity >= item.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="col-span-2 w-full md:w-auto flex justify-between md:justify-end items-center">
                  <span className="md:hidden text-muted-foreground text-sm">Total:</span>
                  <span className="font-bold text-lg">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-muted/30 border border-border rounded-sm p-6 sticky top-24">
              <h2 className="font-serif text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Estimated Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <Button 
                className="w-full h-12 text-base" 
                size="lg"
                onClick={() => setLocation("/checkout")}
              >
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-green-600" /> Secure encrypted checkout
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Award className="h-4 w-4 text-secondary" /> Authenticity guaranteed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// Adding missing imports for icon
import { ShieldCheck, Award } from "lucide-react";