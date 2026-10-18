'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PerfumeCard from '@/components/PerfumeCard';
import PerfumeModal from '@/components/PerfumeModal';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { Perfume, Category, OlfactoryFamily } from '@/types/perfume';
import { getStoredPerfumes } from '@/lib/store';
import { Sparkles, Search, SlidersHorizontal, Star, CheckCircle, Flame } from 'lucide-react';

export default function HomePage() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedFamily, setSelectedFamily] = useState<string>('Toutes');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setPerfumes(getStoredPerfumes());

    // Listen to storage changes (if admin adds a perfume in another tab or same window)
    const handleStorage = () => {
      setPerfumes(getStoredPerfumes());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Filter logic
  const filteredPerfumes = perfumes.filter(perfume => {
    // Category filter
    if (selectedCategory !== 'Tous' && perfume.category !== selectedCategory) {
      return false;
    }
    // Family filter
    if (selectedFamily !== 'Toutes' && perfume.family !== selectedFamily) {
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
    <main className="min-h-screen flex flex-col bg-[#09090b]">
      {/* Navigation & Panier */}
      <Navbar />

      {/* Hero Principal */}
      <Hero />

      {/* Section Best-Sellers (Top Flacons) */}
      <section id="bestsellers" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-b border-zinc-800/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>Les Créations Phares</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
              Nos Incontournables
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md font-light">
            Les sillages les plus demandés. Recommandés pour ceux qui recherchent un impact immédiat et une tenue record.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.slice(0, 3).map(perfume => (
            <PerfumeCard
              key={perfume.id}
              perfume={perfume}
              onOpenDetails={(p) => setSelectedPerfume(p)}
            />
          ))}
        </div>
      </section>

      {/* Section Catalogue Complet */}
      <section id="collection" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-2 block">
            Haute Parfumerie
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal mb-3">
            La Collection Complète
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-light">
            Explorez nos accords rares, boisés, ambrés ou gourmands selon vos envies.
          </p>
        </div>

        {/* Barre de Recherche et Filtres */}
        <div className="space-y-4 mb-10 max-w-4xl mx-auto">
          {/* Champ Recherche */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Rechercher par nom, note (Oud, Vanille, Safran) ou inspiration..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-amber-400/80 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors shadow-inner"
            />
          </div>

          {/* Onglets Filtres (Genre & Famille Olfactive) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Genre */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-900/80 border border-zinc-800 rounded-xl">
              {['Tous', 'Unisexe', 'Homme', 'Femme'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Famille Olfactive */}
            <div className="flex flex-wrap gap-1.5">
              {['Toutes', 'Boisé', 'Ambré', 'Gourmand', 'Floral', 'Cuiré'].map((fam) => (
                <button
                  key={fam}
                  onClick={() => setSelectedFamily(fam)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all border ${
                    selectedFamily === fam
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  {fam}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grille des Parfums */}
        {filteredPerfumes.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 rounded-3xl border border-zinc-800">
            <p className="text-sm text-zinc-400 mb-3">Aucun parfum ne correspond à vos critères de recherche.</p>
            <button
              onClick={() => {
                setSelectedCategory('Tous');
                setSelectedFamily('Toutes');
                setSearchQuery('');
              }}
              className="text-xs text-amber-400 hover:underline font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
      <section id="avis" className="py-14 bg-zinc-950/70 border-t border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-1">
              4.9 / 5 sur plus de 450 commandes
            </h3>
            <p className="text-xs text-zinc-400">Ce que disent nos clients réguliers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
              <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4">
                &ldquo;J&apos;achetais en DM sur Snap avant, le site est tellement plus fluide et carré ! J&apos;ai payé en 2 secondes avec Apple Pay, reçu en 48h dans ma boîte aux lettres avec le petit échantillon offert. L&apos;odeur tient 2 jours sur ma veste.&rdquo;
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
                &ldquo;Oud Mystique est juste incroyable. Rien à envier aux parfums de niche à 300 €. La tenue est folle, tout le monde au bureau m&apos;a demandé ce que je portais.&rdquo;
              </p>
              <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
                <span className="font-bold text-xs text-white">Kenza M. (Paris)</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Achat vérifié
                </span>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
              <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4">
                &ldquo;Livraison en point relais Mondial Relay super rapide, colis blindé de papier bulle, le flacon était intact. Le code SNAP10 a bien fonctionné. Je recommande à 100%.&rdquo;
              </p>
              <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
                <span className="font-bold text-xs text-white">Adrien T. (Marseille)</span>
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

      {/* Modal Détails Parfum */}
      <PerfumeModal
        perfume={selectedPerfume}
        onClose={() => setSelectedPerfume(null)}
      />
    </main>
  );
}
