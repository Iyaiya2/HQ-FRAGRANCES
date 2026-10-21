'use client';

import React, { useState } from 'react';
import { ArrowRight, Star, ShoppingBag, Check } from 'lucide-react';
import { INITIAL_PERFUMES } from '@/lib/initialData';
import { useCart } from '@/lib/cartContext';
import { Perfume } from '@/types/perfume';

interface HeroProps {
  onSelectPerfume?: (perfume: Perfume) => void;
}

export default function Hero({ onSelectPerfume }: HeroProps) {
  const { addToCart } = useCart();
  const spotlightPerfumes = INITIAL_PERFUMES.slice(0, 4);
  const [activeIndex, setActiveIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const activePerfume = spotlightPerfumes[activeIndex] || INITIAL_PERFUMES[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(activePerfume, '50ml');
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <section className="border-b border-zinc-200/80 bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-10 lg:gap-14 items-center">
          {/* Left Column: Pure, Luminous Editorial Message */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.16em] sm:tracking-[0.22em] uppercase text-zinc-500">
              HQ Fragrance Paris • Extrait de Parfum 30%
            </p>

            <h1 className="font-serif text-[2rem] sm:text-[clamp(2.2rem,1.5rem+3.2vw,4rem)] font-bold tracking-tight text-zinc-950 leading-[1.12] sm:leading-[1.1]">
              Haute Parfumerie. <br />
              <span className="font-medium text-zinc-500">Tenue 24 Heures.</span>
            </h1>

            <p className="text-xs sm:text-base text-zinc-600 font-normal leading-relaxed max-w-xl">
              Découvrez nos 11 créations exclusives concentrées à 30% d&apos;extraits purs. Des sillages intenses, gourmands, boisés et fruités.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1 sm:pt-2">
              <a
                href="#collection"
                className="w-full sm:w-auto justify-center px-7 py-3.5 sm:py-4 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all inline-flex items-center gap-2.5 shadow-md"
              >
                <span>Découvrir les 11 Parfums</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Avis Clients sur le Hero */}
            <div className="pt-3.5 sm:pt-4 flex flex-wrap items-center gap-x-3 sm:gap-x-4 lg:gap-x-5 gap-y-2 text-[11px] sm:text-xs text-zinc-600 border-t border-zinc-200">
              <a
                href="#savoir-faire"
                className="inline-flex items-center gap-1.5 sm:gap-2 text-zinc-950 font-semibold hover:text-zinc-700 transition-colors whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-amber-500 text-amber-500"
                    />
                  ))}
                </span>
                <span>4.9/5 (+650 avis clients)</span>
              </a>
              <span className="text-zinc-300">•</span>
              <span className="whitespace-nowrap">Concentration Extrait 30%</span>
              <span className="text-zinc-300">•</span>
              <span className="whitespace-nowrap">Expédition 24/48h France</span>
            </div>
          </div>

          {/* Right Column: Clean White Bottle Showcase */}
          <div className="lg:col-span-5">
            <div className="max-w-md mx-auto lg:max-w-none">
              <div
                onClick={() => onSelectPerfume?.(activePerfume)}
                className="group bg-white border border-zinc-200/90 rounded-2xl overflow-hidden cursor-pointer transition-all shadow-sm hover:shadow-xl hover:border-zinc-300"
              >
                {/* 1:1 Studio Image — Never cropped */}
                <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
                  <img
                    src={activePerfume.image}
                    alt={activePerfume.name}
                    fetchPriority="high"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 bg-white/90 backdrop-blur-md text-zinc-950 text-[10px] sm:text-[0.65rem] font-semibold uppercase tracking-widest px-2.5 py-1 sm:px-3 rounded-full border border-zinc-200 shadow-xs">
                    {activePerfume.badge || 'Best-Seller'}
                  </span>
                </div>

                {/* Simple, Clean Bottom Bar */}
                <div className="p-3.5 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 bg-white">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-[0.7rem] text-zinc-500 truncate">
                      {activePerfume.inspiration}
                    </p>
                    <h2 className="font-serif text-sm sm:text-base lg:text-base xl:text-xl text-zinc-950 font-semibold truncate">
                      {activePerfume.name} — {activePerfume.price} €
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={handleQuickAdd}
                    className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-semibold text-xs shrink-0 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      justAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-950 hover:bg-zinc-800 text-white'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Ajouté</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Ajouter</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Clean 2x2 Grid on Mobile, Centered Row on Desktop */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 mt-3">
                {spotlightPerfumes.map((perf, idx) => (
                  <button
                    key={perf.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`px-3 py-2 sm:py-1.5 rounded-full text-xs text-center truncate transition-all cursor-pointer ${
                      idx === activeIndex
                        ? 'bg-zinc-950 text-white font-semibold shadow-xs'
                        : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    {perf.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
