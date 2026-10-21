'use client';

import React, { useState } from 'react';
import { Perfume } from '@/types/perfume';
import { useCart } from '@/lib/cartContext';
import { ShoppingBag, Check } from 'lucide-react';

interface PerfumeCardProps {
  perfume: Perfume;
  onOpenDetails: (perfume: Perfume) => void;
}

export default function PerfumeCard({ perfume, onOpenDetails }: PerfumeCardProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<'50ml' | '100ml'>('50ml');
  const [justAdded, setJustAdded] = useState(false);

  const currentPrice = selectedSize === '100ml' ? perfume.price100ml : perfume.price;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(perfume, selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article
      onClick={() => onOpenDetails(perfume)}
      className="group luxury-card bg-white border border-zinc-200/90 hover:border-zinc-400 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-xl"
    >
      {/* Pure 1:1 Studio Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
        <img
          src={perfume.image}
          alt={perfume.name}
          loading="lazy"
          width={512}
          height={512}
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
        />

        {perfume.badge && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/95 backdrop-blur-md text-zinc-950 border border-zinc-200/80 text-[9px] sm:text-[0.65rem] font-semibold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs">
            {perfume.badge}
          </span>
        )}
      </div>

      {/* Simple, Clean Card Content */}
      <div className="p-2.5 sm:p-5 flex flex-col flex-1 justify-between gap-2.5 sm:gap-4">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5 sm:gap-2">
            <h3 className="font-serif text-sm sm:text-lg font-semibold text-zinc-950 group-hover:text-zinc-700 transition-colors leading-tight truncate">
              {perfume.name}
            </h3>
            <span className="text-[10px] sm:text-[0.7rem] text-zinc-500 font-medium shrink-0">
              {perfume.family}
            </span>
          </div>

          <p className="text-[10px] sm:text-xs text-zinc-500 mt-1 line-clamp-1 font-normal">
            {[
              ...perfume.notes.top.slice(0, 1),
              ...perfume.notes.heart.slice(0, 1),
              ...perfume.notes.base.slice(0, 1),
            ].join(' · ')}
          </p>
        </div>

        {/* Effortless Size + Price Selection & Add to Cart */}
        <div className="space-y-1.5 sm:space-y-2.5" onClick={e => e.stopPropagation()}>
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 p-0.5 sm:p-1 rounded-lg sm:rounded-xl bg-[#f4f3ef] border border-zinc-200/70">
            <button
              type="button"
              onClick={() => setSelectedSize('50ml')}
              className={`py-1.5 px-1 sm:px-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs whitespace-nowrap transition-all cursor-pointer ${
                selectedSize === '50ml'
                  ? 'bg-white text-zinc-950 font-semibold border border-zinc-300 shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-950 border border-transparent'
              }`}
            >
              <span className="sm:hidden">50ml · {perfume.price}€</span>
              <span className="hidden sm:inline">50 ml · {perfume.price} €</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedSize('100ml')}
              className={`py-1.5 px-1 sm:px-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs whitespace-nowrap transition-all cursor-pointer ${
                selectedSize === '100ml'
                  ? 'bg-white text-zinc-950 font-semibold border border-zinc-300 shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-950 border border-transparent'
              }`}
            >
              <span className="sm:hidden">100ml · {perfume.price100ml}€</span>
              <span className="hidden sm:inline">100 ml · {perfume.price100ml} €</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={justAdded}
            className={`w-full py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-[11px] sm:text-xs tracking-wide whitespace-nowrap transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-950 hover:bg-zinc-800 text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="sm:hidden">Ajouté</span>
                <span className="hidden sm:inline">Ajouté au panier</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span>Ajouter • {currentPrice} €</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
