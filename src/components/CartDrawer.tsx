'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
} from 'lucide-react';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    total,
    shippingFee,
    totalItemsCount,
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <div className="w-screen max-w-md bg-white border-l border-zinc-200 text-zinc-900 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-zinc-950" />
                <h2 className="font-serif text-lg font-bold text-zinc-950">
                  Panier ({totalItemsCount})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#faf9f6]">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
                  <h3 className="font-serif text-2xl text-zinc-950 mb-1">
                    Votre panier est vide
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-6">
                    Découvrez nos 11 créations concentrées à 30% d&apos;extrait.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 rounded-full bg-zinc-950 text-white font-semibold text-xs cursor-pointer"
                  >
                    Voir les parfums
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={`${item.perfume.id}-${item.size}`}
                    className="bg-white border border-zinc-200 rounded-2xl p-3 flex gap-3.5 items-center shadow-2xs"
                  >
                    <img
                      src={item.perfume.image}
                      alt={item.perfume.name}
                      className="w-16 h-16 object-cover rounded-xl bg-zinc-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-lg text-zinc-950 truncate">
                        {item.perfume.name}
                      </h4>
                      <p className="text-xs text-zinc-500">
                        {item.size} •{' '}
                        <span className="text-zinc-950 font-semibold font-mono">
                          {item.price} €
                        </span>
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-zinc-200 rounded-lg bg-[#f4f3ef]">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.perfume.id,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            className="p-1.5 text-zinc-600 hover:text-zinc-950 cursor-pointer"
                            aria-label="Diminuer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-zinc-950 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.perfume.id,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            className="p-1.5 text-zinc-600 hover:text-zinc-950 cursor-pointer"
                            aria-label="Augmenter"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.perfume.id, item.size)
                          }
                          className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-zinc-200 bg-white space-y-3.5">
                <div className="space-y-1.5 text-xs text-zinc-600">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="text-zinc-950 font-mono font-medium">
                      {subtotal.toFixed(2)} €
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="text-zinc-950 font-medium font-mono">
                      {shippingFee === 0 ? 'Offerte' : `${shippingFee.toFixed(2)} €`}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-semibold text-zinc-950 pt-2 border-t border-zinc-200">
                    <span>Total</span>
                    <span className="font-serif text-2xl text-zinc-950">
                      {total.toFixed(2)} €
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Commander • {total.toFixed(2)} €</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
