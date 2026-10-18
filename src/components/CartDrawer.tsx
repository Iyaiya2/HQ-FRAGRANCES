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
  Sparkles,
  Truck,
  ShieldCheck,
  Tag
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
    freeShippingThreshold,
    remainingForFreeShipping,
    promoCode,
    discount,
    promoError,
    applyPromoCode,
    totalItemsCount
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromoCode(inputCode);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-zinc-900 border-l border-zinc-800 text-zinc-100 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h2 className="font-serif text-lg font-normal tracking-wide text-white">
                  Votre Panier ({totalItemsCount})
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                aria-label="Fermer le panier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barre de Progression Livraison Offerte */}
            <div className="bg-zinc-950/80 border-b border-zinc-800/80 p-3.5">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                  <Truck className="w-4 h-4 text-amber-400" />
                  {remainingForFreeShipping > 0 ? (
                    <span>
                      Plus que <strong className="text-amber-400">{remainingForFreeShipping.toFixed(2)} €</strong> pour la livraison offerte !
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold">
                      🎉 Félicitations ! Livraison offerte débloquée !
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-zinc-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Liste des Articles */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-zinc-800/60 flex items-center justify-center mx-auto mb-4 text-zinc-500">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-lg text-white mb-1">Votre panier est vide</h3>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-6">
                    Découvrez notre sélection de fragrances intenses et trouvez votre signature olfactive.
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Explorer la collection
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.perfume.id}-${item.size}`}
                    className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-3 flex gap-3.5 items-center"
                  >
                    {/* Image Miniature */}
                    <img
                      src={item.perfume.image}
                      alt={item.perfume.name}
                      className="w-16 h-20 object-cover rounded-xl bg-zinc-900 border border-zinc-800 shrink-0"
                    />

                    {/* Détails */}
                    <div className="flex-1 min-w-0">
                      {item.perfume.inspiration && (
                        <p className="text-[10px] font-bold text-amber-400 tracking-wider uppercase truncate">
                          {item.perfume.inspiration}
                        </p>
                      )}
                      <h4 className="font-serif text-sm font-normal text-white truncate">
                        {item.perfume.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Flacon {item.size} • <span className="text-white font-medium">{item.price} €</span>
                      </p>

                      {/* Contrôles Quantité */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-zinc-800 rounded-lg bg-zinc-900">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.perfume.id, item.size, item.quantity - 1)}
                            className="p-1 hover:text-amber-400 text-zinc-400 transition-colors"
                            aria-label="Diminuer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.perfume.id, item.size, item.quantity + 1)}
                            className="p-1 hover:text-amber-400 text-zinc-400 transition-colors"
                            aria-label="Augmenter"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.perfume.id, item.size)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Panier : Code Promo & Paiement */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/70 space-y-3">
                {/* Code Promo */}
                <form onSubmit={handleApplyCode} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Code promo (ex: SNAP10)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-400 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 uppercase focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition-colors"
                  >
                    Appliquer
                  </button>
                </form>

                {discount > 0 && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Code <strong>{promoCode}</strong> appliqué (-{discount}%)
                  </p>
                )}

                {promoError && (
                  <p className="text-[11px] text-red-400">{promoError}</p>
                )}

                {/* Calculs Totaux */}
                <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="text-white font-medium">{subtotal.toFixed(2)} €</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Réduction ({discount}%)</span>
                      <span>-{((subtotal * discount) / 100).toFixed(2)} €</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Livraison estimée</span>
                    <span className="text-white font-medium">
                      {shippingFee === 0 ? (
                        <span className="text-amber-400 font-bold uppercase">Offerte</span>
                      ) : (
                        `${shippingFee.toFixed(2)} €`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                    <span>Total</span>
                    <span className="font-serif text-lg text-amber-400">{total.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Bouton Checkout */}
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Commander ({total.toFixed(2)} €)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Apple Pay • Google Pay • CB Sécurisée 3D-Secure</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Commande */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
