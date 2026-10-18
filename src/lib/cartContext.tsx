'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Perfume, CartItem, ShippingMethod } from '@/types/perfume';

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (perfume: Perfume, size: '50ml' | '100ml') => void;
  removeFromCart: (perfumeId: string, size: '50ml' | '100ml') => void;
  updateQuantity: (perfumeId: string, size: '50ml' | '100ml', quantity: number) => void;
  clearCart: () => void;
  promoCode: string;
  discount: number;
  promoError: string | null;
  applyPromoCode: (code: string) => boolean;
  shippingMethod: ShippingMethod;
  setShippingMethod: (method: ShippingMethod) => void;
  shippingFee: number;
  subtotal: number;
  total: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 60; // Livraison offerte dès 60€

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('mondial_relay');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('elysee_cart_items');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage on cart change
  useEffect(() => {
    try {
      localStorage.setItem('elysee_cart_items', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (perfume: Perfume, size: '50ml' | '100ml') => {
    const itemPrice = size === '100ml' ? perfume.price100ml : perfume.price;
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.perfume.id === perfume.id && item.size === size);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        return next;
      }
      return [...prev, { perfume, size, quantity: 1, price: itemPrice }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (perfumeId: string, size: '50ml' | '100ml') => {
    setCart(prev => prev.filter(item => !(item.perfume.id === perfumeId && item.size === size)));
  };

  const updateQuantity = (perfumeId: string, size: '50ml' | '100ml', quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(perfumeId, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.perfume.id === perfumeId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setPromoCode('');
  };

  const applyPromoCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SNAP10' || cleanCode === 'BIENVENUE10') {
      setPromoCode(cleanCode);
      setDiscount(10); // 10%
      setPromoError(null);
      return true;
    } else if (cleanCode === 'OFFERT') {
      setPromoCode(cleanCode);
      setDiscount(15);
      setPromoError(null);
      return true;
    } else {
      setPromoError('Code promo invalide. Essayez SNAP10');
      return false;
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Free shipping if subtotal >= 60€
  let shippingFee = 0;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    shippingFee = 0;
  } else {
    if (shippingMethod === 'mondial_relay') shippingFee = 3.90;
    else if (shippingMethod === 'colissimo') shippingFee = 5.90;
    else shippingFee = 0; // remise en main propre
  }

  const discountAmount = (subtotal * discount) / 100;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        promoCode,
        discount,
        promoError,
        applyPromoCode,
        shippingMethod,
        setShippingMethod,
        shippingFee,
        subtotal,
        total,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        remainingForFreeShipping,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
