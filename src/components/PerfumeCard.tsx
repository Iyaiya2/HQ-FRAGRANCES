'use client';

import React, { useState } from 'react';
import { Perfume } from '@/types/perfume';
import { useCart } from '@/lib/cartContext';
import { ShoppingBag, Eye, Check, Flame, Sparkles } from 'lucide-react';

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
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div
      onClick={() => onOpenDetails(perfume)}
      className="group bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:shadow-amber-950/20"
    >
      {/* Zone Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950 flex items-center justify-center p-2 sm:p-3">
        <img
          src={perfume.image}
          alt={perfume.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-2xl"
          loading="lazy"
        />

        {/* Badges Flottants */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {perfume.isBestSeller && (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-zinc-950 font-bold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md">
              <Flame className="w-3 h-3 fill-zinc-950" />
              Best-Seller
            </span>
          )}
          {perfume.isNew && (
            <span className="inline-flex items-center gap-1 bg-zinc-800/90 text-amber-300 border border-amber-500/30 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full backdrop-blur-sm">
              <Sparkles className="w-2.5 h-2.5" />
              Nouveau
            </span>
          )}
        </div>

        {/* Concentration Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-black/75 backdrop-blur-md text-zinc-300 border border-white/10 text-[10px] px-2 py-0.5 rounded-full font-medium">
            {perfume.concentration}
          </span>

          {perfume.stock <= 5 && (
            <span className="bg-red-950/80 backdrop-blur-md text-red-300 border border-red-500/30 text-[10px] px-2 py-0.5 rounded-full font-medium animate-pulse">
              Plus que {perfume.stock} en stock
            </span>
          )}
        </div>
      </div>

      {/* Zone Contenu */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Inspiration / Marque */}
          {perfume.inspiration && (
            <p className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase mb-1">
              {perfume.inspiration}
            </p>
          )}

          {/* Nom du parfum */}
          <h3 className="font-serif text-lg sm:text-xl font-normal text-white group-hover:text-amber-300 transition-colors">
            {perfume.name}
          </h3>

          {/* Famille Olfactive & Notes Rapides */}
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {perfume.description}
          </p>

          {/* Mini pyramide (3 notes clés) */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {[...perfume.notes.top.slice(0, 1), ...perfume.notes.heart.slice(0, 1), ...perfume.notes.base.slice(0, 1)].map((note, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-zinc-800/60 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-700/50"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Sélecteur de Taille (50ml / 100ml) & Prix */}
        <div className="pt-3 border-t border-zinc-800/80">
          <div className="flex items-center justify-between gap-2 mb-3">
            {/* Boutons Taille */}
            <div className="inline-flex p-0.5 rounded-lg bg-zinc-950 border border-zinc-800" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setSelectedSize('50ml')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  selectedSize === '50ml'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                50 ml
              </button>
              <button
                type="button"
                onClick={() => setSelectedSize('100ml')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  selectedSize === '100ml'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                100 ml
              </button>
            </div>

            {/* Prix Dynamique */}
            <div className="text-right">
              <span className="font-serif text-xl sm:text-2xl font-light text-white">
                {currentPrice} €
              </span>
            </div>
          </div>

          {/* Boutons d'Action (Ajouter au panier & Aperçu) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={justAdded}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 shadow-md ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-100 hover:bg-amber-400 text-zinc-950'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Ajouté !</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Ajouter au panier</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(perfume);
              }}
              className="p-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
              title="Voir la pyramide olfactive"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
