'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PerfumeCard from '@/components/PerfumeCard';
import PerfumeModal from '@/components/PerfumeModal';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { Perfume, OlfactoryFamily } from '@/types/perfume';
import { getStoredPerfumes } from '@/lib/store';
import { Sparkles, Search, Star, CheckCircle, Flame, Award, Shield } from 'lucide-react';

export default function HomePage() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);

  // Filters
  const [selectedFilter, setSelectedFilter] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setPerfumes(getStoredPerfumes());

    const handleStorage = () => {
      setPerfumes(getStoredPerfumes());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Filter logic
  const filteredPerfumes = perfumes.filter(perfume => {
    // Custom filter tabs
    if (selectedFilter === 'Best-Sellers' && !perfume.isBestSeller) {
      return false;
    }
    if (selectedFilter === 'Gourmands' && perfume.family !== 'Gourmand') {
      return false;
    }
    if (selectedFilter === 'Boisés & Cuirés' && perfume.family !== 'Boisé' && perfume.family !== 'Cuiré') {
      return false;
    }
    if (selectedFilter === 'Ambrés' && perfume.family !== 'Ambré') {
      return false;
    }
    if (selectedFilter === 'Frais' && perfume.family !== 'Frais') {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = perfume.name.toLowerCase().includes(q);
      const matchInsp = perfume.inspiration?.toLowerCase().includes(q) || false;
      const matchDesc = perfume.description.toLowerCase().includes(q);
      const matchNotes = [
        ...perfume.notes.top,
        ...perfume.notes.heart,
        ...perfume.notes.base
      ].some(n => n.toLowerCase().includes(q));
      return matchName || matchInsp || matchDesc || matchNotes;
    }
    return true;
  });

  const bestSellers = perfumes.filter(p => p.isBestSeller);

  return (
    <main className="min-h-screen flex flex-col bg-[#08080a]">
      {/* Navigation */}
      <Navbar />

      {/* Hero Principal */}
      <Hero />

      {/* Section Best-Sellers (Top 4 Flacons Masculins) */}
      <section id="bestsellers" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-b border-zinc-800/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>Sillages Phares Pour Homme</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
              Les Incontournables HQ
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md font-light">
            Les flacons les plus commandés par notre communauté Snapchat. Tenue garantie 24 heures et sillage ultra magnétique.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {bestSellers.slice(0, 4).map(perfume => (
            <PerfumeCard
              key={perfume.id}
              perfume={perfume}
              onOpenDetails={(p) => setSelectedPerfume(p)}
            />
          ))}
        </div>
      </section>

      {/* Section Collection Complète (Les 11 Fragrances) */}
      <section id="collection" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-2 block">
            Catalogue Officiel HQ Fragrance
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal mb-3">
            Les 11 Créations Masculines
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-light">
            Formulés avec 30% d&apos;huiles de parfum pures. Choisissez la signature olfactive qui correspond à votre caractère.
          </p>
        </div>

        {/* Barre de Recherche et Filtres Homme */}
        <div className="space-y-4 mb-10 max-w-4xl mx-auto">
          {/* Recherche */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Rechercher parmi les 11 parfums (Vanille, Cuir, Mangue, Litchi, Caramel...)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-amber-400/80 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors shadow-inner"
            />
          </div>

          {/* Onglets Filtres (Spécial Homme) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {[
              { label: 'Tous (11)', val: 'Tous' },
              { label: '🔥 Best-Sellers', val: 'Best-Sellers' },
              { label: '🍬 Gourmands & Sucrés', val: 'Gourmands' },
              { label: '🪵 Boisés & Cuirés', val: 'Boisés & Cuirés' },
              { label: '✨ Ambrés & Épicés', val: 'Ambrés' },
              { label: '🌊 Frais & Énergiques', val: 'Frais' },
            ].map(tab => (
              <button
                key={tab.val}
                onClick={() => setSelectedFilter(tab.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedFilter === tab.val
                    ? 'border-amber-400 bg-amber-400 text-zinc-950 shadow-md font-bold'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des 11 Parfums */}
        {filteredPerfumes.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 rounded-3xl border border-zinc-800">
            <p className="text-sm text-zinc-400 mb-3">Aucun parfum ne correspond à vos critères de recherche.</p>
            <button
              onClick={() => {
                setSelectedFilter('Tous');
                setSearchQuery('');
              }}
              className="text-xs text-amber-400 hover:underline font-medium"
            >
              Afficher les 11 parfums
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredPerfumes.map(perfume => (
              <PerfumeCard
                key={perfume.id}
                perfume={perfume}
                onOpenDetails={(p) => setSelectedPerfume(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Section Avis Clients Snapchat Vérifiés */}
      <section id="avis" className="py-14 bg-zinc-950/80 border-t border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-1">
              4.9 / 5 • Plus de 600 hommes conquis
            </h3>
            <p className="text-xs text-zinc-400">Retours vérifiés de nos clients réguliers sur Snapchat</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
              <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4">
                &ldquo;J&apos;ai pris King Vanille et Ultra Men Intense. L&apos;odeur de King Vanille est juste monumentale, virile et gourmande en même temps. Tout le monde au taf me demande où je l&apos;ai acheté. Reçu en 48h chrono.&rdquo;
              </p>
              <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
                <span className="font-bold text-xs text-white">Karim D. (Paris)</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Achat vérifié
                </span>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
              <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4">
                &ldquo;Franchement je commandais sur Snap en DM avant, le site est 10 fois plus rapide. J&apos;ai validé avec Apple Pay en 10 secondes, reçu par Mondial Relay nickel. Mulla Rouge est une masterclass.&rdquo;
              </p>
              <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
                <span className="font-bold text-xs text-white">Yassine B. (Lyon)</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Achat vérifié
                </span>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
              <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4">
                &ldquo;Cookie Caramel est ultra addictif, une odeur de fou furieux qui tient facile 2 jours sur ma doudoune. Le code promo SNAP10 a marché direct et livraison offerte dès 2 flacons. Très lourd.&rdquo;
              </p>
              <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
                <span className="font-bold text-xs text-white">Samy L. (Marseille)</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Achat vérifié
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Drawer Panier */}
      <CartDrawer />

      {/* Modal Détails Flacon */}
      <PerfumeModal
        perfume={selectedPerfume}
        onClose={() => setSelectedPerfume(null)}
      />
    </main>
  );
}
