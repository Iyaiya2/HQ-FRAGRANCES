'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PerfumeCard from '@/components/PerfumeCard';
import PerfumeModal from '@/components/PerfumeModal';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { Perfume } from '@/types/perfume';
import { INITIAL_PERFUMES } from '@/lib/initialData';
import { getStoredPerfumes } from '@/lib/store';
import { Star, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const [perfumes, setPerfumes] = useState<Perfume[]>(INITIAL_PERFUMES);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);

  // Simple Filters
  const [selectedFilter, setSelectedFilter] = useState<string>('Tous');

  useEffect(() => {
    setPerfumes(getStoredPerfumes());

    const handleStorage = () => {
      setPerfumes(getStoredPerfumes());
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('hq-catalog-updated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('hq-catalog-updated', handleStorage);
    };
  }, []);

  const filteredPerfumes = perfumes.filter(perfume => {
    if (selectedFilter === 'Best-Sellers' && !perfume.isBestSeller) {
      return false;
    }
    if (
      selectedFilter === 'Gourmands' &&
      perfume.family !== 'Gourmand' &&
      perfume.id !== 'hq-king-vanille'
    ) {
      return false;
    }
    if (
      selectedFilter === 'Fruités' &&
      perfume.family !== 'Fruité' &&
      perfume.id !== 'hq-mulla-rouge'
    ) {
      return false;
    }
    if (
      selectedFilter === 'Boisés & Ambrés' &&
      perfume.family !== 'Boisé' &&
      perfume.family !== 'Ambré' &&
      perfume.family !== 'Cuiré'
    ) {
      return false;
    }
    if (
      selectedFilter === 'Frais' &&
      perfume.family !== 'Frais' &&
      perfume.id !== 'hq-krypto' &&
      perfume.id !== 'hq-exotic-mango'
    ) {
      return false;
    }

    return true;
  });

  return (
    <main className="min-h-screen flex flex-col bg-[#faf9f6] text-zinc-900">
      <Navbar />

      <Hero onSelectPerfume={p => setSelectedPerfume(p)} />

      {/* 1. LA COLLECTION : LES 11 PARFUMS */}
      <section
        id="collection"
        className="py-10 sm:py-20 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 w-full flex-1"
      >
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 sm:gap-6 mb-7 sm:mb-10">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-zinc-500 mb-1 sm:mb-1.5">
              Collection Signature
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl xl:text-4xl text-zinc-950 font-bold tracking-tight">
              Nos 11 Extraits de Parfum
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { label: `Tous (${perfumes.length})`, val: 'Tous' },
              { label: 'Best-Sellers', val: 'Best-Sellers' },
              { label: 'Vanillés & Gourmands', val: 'Gourmands' },
              { label: 'Fruités', val: 'Fruités' },
              { label: 'Boisés & Ambrés', val: 'Boisés & Ambrés' },
              { label: 'Frais', val: 'Frais' },
            ].map(tab => (
              <button
                key={tab.val}
                type="button"
                onClick={() => setSelectedFilter(tab.val)}
                className={`px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                  selectedFilter === tab.val
                    ? 'bg-zinc-950 text-white font-semibold shadow-xs'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:border-zinc-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Responsive Product Grid: 2 cols mobile, 3 cols tablet/iPad, 4 cols desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5 xl:gap-6">
          {filteredPerfumes.map(perfume => (
            <PerfumeCard
              key={perfume.id}
              perfume={perfume}
              onOpenDetails={p => setSelectedPerfume(p)}
            />
          ))}
        </div>
      </section>

      {/* 2. AVIS CLIENTS */}
      <section
        id="savoir-faire"
        className="py-12 sm:py-20 border-t border-zinc-200/80 bg-[#f3f1ec]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-zinc-500 mb-1.5 sm:mb-2">
              Avis Clients Vérifiés
            </p>
            <h2 className="font-serif text-xl sm:text-3xl text-zinc-950 font-bold">
              Noté 4.9/5 par plus de 650 clients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                name: 'Karim D.',
                city: 'Paris',
                perfume: 'King Vanille',
                text: 'L’odeur de King Vanille est juste incroyable, boisée et vanillée à la perfection. Deux sprays le matin et ça tient jusqu’au lendemain. Reçu en 48h.',
              },
              {
                name: 'Sarah M.',
                city: 'Lyon',
                perfume: 'Kaya Litchi & Marshmallow',
                text: 'Kaya Litchi et Kaya Marshmallow sont des pépites. L’odeur est ultra réaliste et tient toute la journée sur mes vêtements. Je recommande à 100%.',
              },
              {
                name: 'Yassine B.',
                city: 'Marseille',
                perfume: 'Cookie Caramel & Mulla Rouge',
                text: 'Cookie Caramel sent vraiment le caramel fondant et la vanille, et Mulla Rouge pour sortir le soir laisse un sillage magnifique.',
              },
            ].map((rev, idx) => (
              <div
                key={idx}
                className="bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {rev.perfume}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 font-normal leading-relaxed mb-5">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs">
                  <span className="font-semibold text-zinc-950">
                    {rev.name} ({rev.city})
                  </span>
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Vérifié
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <CartDrawer />
      <PerfumeModal
        perfume={selectedPerfume}
        onClose={() => setSelectedPerfume(null)}
      />
    </main>
  );
}
