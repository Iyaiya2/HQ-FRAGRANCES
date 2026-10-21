'use client';

import React, { useState } from 'react';
import { ArrowRight, Star, ShoppingBag, Check } from 'lucide-react';
import { INITIAL_PERFUMES } from '@/lib/initialData';
import { useCart } from '@/lib/cartContext';
import { Perfume } from '@/types/perfume';

interface HeroProps {
  onSelectPerfume?: (perfume: Perfume) => void;
}

/**
 * Scènes panoramiques "prolongées" (même décor que la photo du flacon, sans le flacon).
 * Les parfums sans scène dédiée utilisent leur propre photo en fond ambiant flouté.
 */
const HERO_SCENES: Record<string, string> = {
  'hq-king-vanille': '/images/hero/king-vanille-scene.jpg',
};

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
    <section className="relative isolate overflow-hidden bg-[#1a120b]">
      {/* ===== Fond du Hero : la suite de l'image du flacon actif ===== */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {spotlightPerfumes.map((perf, idx) => {
          const scene = HERO_SCENES[perf.id];
          const isActive = idx === activeIndex;
          return (
            <img
              key={perf.id}
              src={scene || perf.image}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
                scene
                  ? 'object-[70%_center] lg:object-right'
                  : 'object-center scale-125 blur-2xl saturate-150'
              } ${isActive ? 'opacity-100' : 'opacity-0'}`}
            />
          );
        })}

        {/* Voile de lisibilité : sombre à gauche (texte), transparent à droite (flacon) */}
        <div className="absolute inset-0 bg-black/55 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-black/45 lg:to-black/5" />
        {/* Fondu doux vers le catalogue en bas */}
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-b from-transparent to-[#faf9f6]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Message posé sur la scène */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.16em] sm:tracking-[0.22em] uppercase text-[#e9d7b4]">
              HQ Fragrance Paris • Extrait de Parfum 30%
            </p>

            <h1 className="font-serif text-[2rem] sm:text-[clamp(2.2rem,1.5rem+3.2vw,4rem)] font-bold tracking-tight text-white leading-[1.12] sm:leading-[1.1]">
              Haute Parfumerie. <br />
              <span className="font-medium text-[#e9d7b4]">Tenue 24 Heures.</span>
            </h1>

            <p className="text-xs sm:text-base text-zinc-200 font-normal leading-relaxed max-w-xl">
              Découvrez nos 11 créations exclusives concentrées à 30% d&apos;extraits purs. Des sillages intenses, gourmands, boisés et fruités.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1 sm:pt-2">
              <a
                href="#collection"
                className="w-full sm:w-auto justify-center px-7 py-3.5 sm:py-4 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs sm:text-sm tracking-wide transition-all inline-flex items-center gap-2.5 shadow-lg"
              >
                <span>Découvrir les 11 Parfums</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Avis Clients sur le Hero */}
            <div className="pt-3.5 sm:pt-4 flex flex-wrap items-center gap-x-3 sm:gap-x-4 lg:gap-x-5 gap-y-2 text-[11px] sm:text-xs text-zinc-300 border-t border-white/15">
              <a
                href="#savoir-faire"
                className="inline-flex items-center gap-1.5 sm:gap-2 text-white font-semibold hover:text-zinc-200 transition-colors whitespace-nowrap"
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
              <span className="text-white/30">•</span>
              <span className="whitespace-nowrap">Concentration Extrait 30%</span>
              <span className="text-white/30">•</span>
              <span className="whitespace-nowrap">Expédition 24/48h France</span>
            </div>
          </div>

          {/* Right Column: Flacon qui se fond dans la scène */}
          <div className="lg:col-span-5">
            <div className="max-w-md mx-auto lg:max-w-none">
              <div
                onClick={() => onSelectPerfume?.(activePerfume)}
                className="group rounded-2xl overflow-hidden cursor-pointer transition-all ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.75)] hover:ring-white/30"
              >
                {/* 1:1 Studio Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#2a1c10]">
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

                {/* Barre verre fumé */}
                <div className="p-3.5 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 bg-black/45 backdrop-blur-xl">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-[0.7rem] text-zinc-300 truncate">
                      {activePerfume.inspiration}
                    </p>
                    <h2 className="font-serif text-sm sm:text-base lg:text-base xl:text-xl text-white font-semibold truncate">
                      {activePerfume.name} — {activePerfume.price} €
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={handleQuickAdd}
                    className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-semibold text-xs shrink-0 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      justAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white hover:bg-zinc-200 text-zinc-950'
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
                        ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                        : 'bg-black/30 backdrop-blur-md border border-white/20 text-zinc-200 hover:text-white hover:border-white/40'
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
