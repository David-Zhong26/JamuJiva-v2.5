import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ShopProductId } from '../constants/shopProducts';
import { cartLineTitle } from '../constants/shopProducts';

export type CartLine = {
  productId: ShopProductId;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (productId: ShopProductId, quantity?: number) => void;
  setQuantity: (productId: ShopProductId, quantity: number) => void;
  removeItem: (productId: ShopProductId) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);

  const addItem = useCallback((productId: ShopProductId, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const setQuantity = useCallback((productId: ShopProductId, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) {
        return prev.filter((l) => l.productId !== productId);
      }
      return prev.map((l) => (l.productId === productId ? { ...l, quantity } : l));
    });
  }, []);

  const removeItem = useCallback((productId: ShopProductId) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  const value = useMemo(
    () => ({ lines, itemCount, isOpen, setOpen, addItem, setQuantity, removeItem, clearCart }),
    [lines, itemCount, isOpen, addItem, setQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}

export function cartLineLabel(line: CartLine) {
  return cartLineTitle(line.productId);
}
