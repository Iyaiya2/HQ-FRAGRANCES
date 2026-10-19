'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Perfume, CartItem, ShippingMethod } from '@/types/perfume';
import { INITIAL_PERFUMES } from './initialData';

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (perfume: Perfume, size: '50ml' | '100ml', openDrawer?: boolean) => void;
  removeFromCart: (perfumeId: string, size: '50ml' | '100ml') => void;
  updateQuantity: (perfumeId: string, size: '50ml' | '100ml', quantity: number) => void;
  clearCart: () => void;
  promoCode: string;
  discount: number;
  discountAmount: number;
  promoError: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
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
const CART_STORAGE_KEY = 'hq_fragrance_cart_v2';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('mondial_relay');

  // Load from localStorage on mount & normalize images
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map(item => {
            const official = INITIAL_PERFUMES.find(p => p.id === item.perfume?.id);
            return {
              ...item,
              perfume: {
                ...(official || {}),
                ...item.perfume,
                image:
                  official?.image ||
                  item.perfume?.image?.replace(/\.png$/i, '.jpg') ||
                  '/images/perfumes/king-vanille.jpg',
              },
            };
          });
          setCart(normalized);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage on cart change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (perfume: Perfume, size: '50ml' | '100ml', openDrawer = true) => {
    const itemPrice = size === '100ml' ? perfume.price100ml : perfume.price;
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.perfume.id === perfume.id && item.size === size
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      }
      return [...prev, { perfume, size, quantity: 1, price: itemPrice }];
    });
    if (openDrawer) {
      setIsOpen(true);
    }
  };

  const removeFromCart = (perfumeId: string, size: '50ml' | '100ml') => {
    setCart(prev =>
      prev.filter(item => !(item.perfume.id === perfumeId && item.size === size))
    );
  };

  const updateQuantity = (
    perfumeId: string,
    size: '50ml' | '100ml',
    quantity: number
  ) => {
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
    setPromoError(null);
  };

  const applyPromoCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SNAP10' || cleanCode === 'BIENVENUE10' || cleanCode === 'HQ10') {
      setPromoCode(cleanCode);
      setDiscount(10); // 10%
      setPromoError(null);
      return true;
    } else if (cleanCode === 'OFFERT' || cleanCode === 'VIP15') {
      setPromoCode(cleanCode);
      setDiscount(15); // 15%
      setPromoError(null);
      return true;
    } else {
      setPromoError('Code promo invalide. Utilisez SNAP10 (-10%)');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscount(0);
    setPromoError(null);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Free shipping if subtotal >= 60€
  let shippingFee = 0;
  if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) {
    shippingFee = 0;
  } else {
    if (shippingMethod === 'mondial_relay') shippingFee = 3.9;
    else if (shippingMethod === 'colissimo') shippingFee = 5.9;
    else shippingFee = 0;
  }

  const discountAmount = Number(((subtotal * discount) / 100).toFixed(2));
  const total = Math.max(0, Number((subtotal - discountAmount + shippingFee).toFixed(2)));
  const remainingForFreeShipping = Math.max(
    0,
    Number((FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2))
  );

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
        discountAmount,
        promoError,
        applyPromoCode,
        removePromoCode,
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
