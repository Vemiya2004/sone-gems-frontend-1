import React, { createContext, useContext, useState, useEffect } from "react";
import { Gem, OrderItem } from "@/api-client";
import { useAuth } from "./AuthContext";

interface CartContextType {
  items: OrderItem[];
  addItem: (gem: Gem, quantity: number) => void;
  removeItem: (gemId: string) => void;
  updateQuantity: (gemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const cartKey = user ? `wg_cart_${user.id}` : "wg_cart_guest";

  const [items, setItems] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem(cartKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const saved = localStorage.getItem(cartKey);
    setItems(saved ? JSON.parse(saved) : []);
  }, [cartKey]);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, cartKey]);

  const addItem = (gem: Gem, quantity: number) => {
    setItems((current) => {
      const existing = current.find((item) => item.gemId === gem.id);
      if (existing) {
        return current.map((item) =>
          item.gemId === gem.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, gem.stock) }
            : item
        );
      }
      return [
        ...current,
        {
          gemId: gem.id,
          name: gem.name,
          price: gem.discountedPrice || gem.price,
          quantity: Math.min(quantity, gem.stock),
          image: gem.images?.[0] || null,
          stock: gem.stock,
        },
      ];
    });
  };

  const removeItem = (gemId: string) => {
    setItems((current) => current.filter((item) => item.gemId !== gemId));
  };

  const updateQuantity = (gemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(gemId);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.gemId === gemId ? { ...item, quantity: Math.min(quantity, item.stock || Infinity) } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}