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
import { Search, Star, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const [perfumes, setPerfumes] = useState<Perfume[]>(INITIAL_PERFUMES);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);

  // Simple Filters & Search
  const [selectedFilter, setSelectedFilter] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');

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

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = perfume.name.toLowerCase().includes(q);
      const matchInsp = perfume.inspiration?.toLowerCase().includes(q) || false;
      const matchNotes = [
        ...perfume.notes.top,
        ...perfume.notes.heart,
        ...perfume.notes.base,
      ].some(n => n.toLowerCase().includes(q));
      return matchName || matchInsp || matchNotes;
    }
    return true;
  });

  return (
    <main className="min-h-screen flex flex-col bg-[#08080a]">
      <Navbar />

      <Hero onSelectPerfume={p => setSelectedPerfume(p)} />

      {/* 1. LA COLLECTION : LES 11 PARFUMS */}
      <section
        id="collection"
        className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#e6d5b8] mb-1.5">
              Collection Signature
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal tracking-tight">
              Nos 11 Extraits de Parfum
            </h2>
          </div>

          {/* Simple Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
            <input
              type="text"
              placeholder="Rechercher un parfum ou une note..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#101014] border border-white/[0.1] focus:border-white/30 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Simple Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
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
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedFilter === tab.val
                  ? 'bg-white text-zinc-950 font-semibold'
                  : 'bg-[#101014] border border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Clean 4-Column Product Grid */}
        {filteredPerfumes.length === 0 ? (
          <div className="text-center py-16 bg-[#101014] rounded-2xl border border-white/[0.08]">
            <p className="text-sm text-zinc-300 mb-4">
              Aucun parfum ne correspond à « {searchQuery} ».
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedFilter('Tous');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-full bg-white text-zinc-950 text-xs font-semibold cursor-pointer"
            >
              Voir tous les parfums
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredPerfumes.map(perfume => (
              <PerfumeCard
                key={perfume.id}
                perfume={perfume}
                onOpenDetails={p => setSelectedPerfume(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. AVIS CLIENTS */}
      <section
        id="savoir-faire"
        className="py-16 sm:py-20 border-t border-white/[0.08] bg-[#08080a]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.22em] text-[#e6d5b8] mb-2">
              Avis Clients Vérifiés
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              Noté 4.9/5 par plus de 650 clients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className="bg-[#101014] border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-[#e6d5b8]">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-[#e6d5b8]" />
                      ))}
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      {rev.perfume}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-5">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs">
                  <span className="font-medium text-white">
                    {rev.name} ({rev.city})
                  </span>
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Vérifié
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
