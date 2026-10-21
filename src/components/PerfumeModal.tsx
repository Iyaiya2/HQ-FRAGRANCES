'use client';

import React, { useState } from 'react';
import { Perfume } from '@/types/perfume';
import { useCart } from '@/lib/cartContext';
import { X, ShoppingBag, Check, Star } from 'lucide-react';

interface PerfumeModalProps {
  perfume: Perfume | null;
  onClose: () => void;
}

export default function PerfumeModal({ perfume, onClose }: PerfumeModalProps) {
  const { addToCart } = useCart();
  const [size, setSize] = useState<'50ml' | '100ml'>('50ml');
  const [justAdded, setJustAdded] = useState(false);

  if (!perfume) return null;

  const currentPrice = size === '100ml' ? perfume.price100ml : perfume.price;

  const handleAdd = () => {
    addToCart(perfume, size);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 650);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[92dvh] overflow-y-auto bg-white border border-zinc-200 rounded-3xl shadow-2xl z-10 grid grid-cols-1 md:grid-cols-12 overflow-hidden text-zinc-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 border border-zinc-200 transition-colors cursor-pointer shadow-xs"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Studio Photo — Full aspect-square on mobile, fills 100% height to the bottom on desktop */}
        <div className="md:col-span-6 relative bg-zinc-100 aspect-square md:aspect-auto md:min-h-full overflow-hidden">
          <img
            src={perfume.image}
            alt={perfume.name}
            className="w-full h-full object-cover object-center md:absolute md:inset-0"
          />
        </div>

        {/* Right Column: Clean Product Details (sans le bloc Notes de tête / cœur / fond) */}
        <div className="md:col-span-6 p-5 sm:p-8 flex flex-col justify-between gap-5 sm:gap-6 bg-white">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 mb-2">
              <span className="uppercase tracking-widest text-zinc-600 font-semibold">
                {perfume.family} • Extrait 30%
              </span>
              <span className="inline-flex items-center gap-1 text-zinc-950 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {(perfume.rating || 4.9).toFixed(1)} ({perfume.reviewsCount || 85} avis)
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-zinc-950 font-bold">
              {perfume.name}
            </h2>

            {perfume.inspiration && (
              <p className="text-xs text-zinc-500 mt-1 mb-3 sm:mb-4">
                {perfume.inspiration}
              </p>
            )}

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal mb-5 sm:mb-6">
              {perfume.description}
            </p>

            {/* Format Selection */}
            <div className="space-y-2">
              <span className="text-xs text-zinc-500 font-medium block">
                Choisir la contenance :
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSize('50ml')}
                  className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    size === '50ml'
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                      : 'border-zinc-200 bg-[#f7f6f2] text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  <div className="font-semibold text-xs sm:text-sm">50 ml</div>
                  <div className="font-serif text-lg sm:text-xl mt-0.5 font-bold">
                    {perfume.price} €
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSize('100ml')}
                  className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    size === '100ml'
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                      : 'border-zinc-200 bg-[#f7f6f2] text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  <div className="font-semibold text-xs sm:text-sm">100 ml</div>
                  <div className="font-serif text-lg sm:text-xl mt-0.5 font-bold">
                    {perfume.price100ml} €
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="pt-1 sm:pt-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={justAdded}
              className={`w-full py-3.5 sm:py-4 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-md'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ajouté au panier</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    Ajouter au panier • {size} ({currentPrice} €)
                  </span>
                </>
              )}
            </button>
            <p className="text-[11px] text-zinc-500 text-center mt-2.5">
              En stock • Expédition sous 24h • Paiement sécurisé Apple Pay &amp; CB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
