'use client';

import React, { useState } from 'react';
import { Perfume } from '@/types/perfume';
import { useCart } from '@/lib/cartContext';
import { X, ShoppingBag, Check, Sparkles, ShieldCheck, Clock, Truck } from 'lucide-react';

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
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Background backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-zinc-300 hover:text-white border border-white/10 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Colonne Image */}
        <div className="relative h-64 md:h-full min-h-[300px] bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950 flex items-center justify-center p-4 overflow-hidden">
          <img
            src={perfume.image}
            alt={perfume.name}
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent md:hidden" />
          <div className="absolute top-4 left-4">
            <span className="bg-amber-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {perfume.concentration}
            </span>
          </div>
        </div>

        {/* Colonne Informations */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {perfume.inspiration && (
              <p className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-1">
                {perfume.inspiration}
              </p>
            )}

            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-2">
              {perfume.name}
            </h2>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full border border-zinc-700">
                Famille {perfume.family}
              </span>
              <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full border border-zinc-700">
                {perfume.category}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 font-light">
              {perfume.description}
            </p>

            {/* Pyramide Olfactive Détaillée */}
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4 mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Pyramide Olfactive
              </h4>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-zinc-400 font-medium">Notes de tête : </span>
                  <span className="text-zinc-200">{perfume.notes.top.join(', ')}</span>
                </div>
                <div>
                  <span className="text-zinc-400 font-medium">Notes de cœur : </span>
                  <span className="text-zinc-200">{perfume.notes.heart.join(', ')}</span>
                </div>
                <div>
                  <span className="text-zinc-400 font-medium">Notes de fond : </span>
                  <span className="text-zinc-200">{perfume.notes.base.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Choix de Contenance */}
            <div className="mb-6">
              <label className="text-xs font-medium text-zinc-300 block mb-2">
                Choisir la contenance :
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSize('50ml')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    size === '50ml'
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-sm">Flacon 50 ml</div>
                  <div className="text-xs text-amber-300/90">{perfume.price} €</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSize('100ml')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    size === '100ml'
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-sm">Flacon 100 ml</div>
                  <div className="text-xs text-amber-300/90">{perfume.price100ml} €</div>
                </button>
              </div>
            </div>
          </div>

          {/* Prix et Ajout au panier */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-zinc-400">Total à payer</p>
                <p className="font-serif text-3xl font-light text-white">{currentPrice} €</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  En stock ({perfume.stock} dispo)
                </span>
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={justAdded}
              className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-xl ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-amber-500/20'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ajouté au panier !</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ajouter au panier • {currentPrice} €</span>
                </>
              )}
            </button>

            {/* Garanties */}
            <div className="flex items-center justify-around gap-2 mt-4 pt-4 border-t border-zinc-800 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                Expédié en 24h
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Paiement sécurisé
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
