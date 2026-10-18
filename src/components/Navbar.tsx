'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, ShieldCheck, Truck, Lock } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export default function Navbar() {
  const { totalItemsCount, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#09090b]/85 border-b border-zinc-800/80 transition-all">
      {/* Top Bar Promotionnelle */}
      <div className="bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 border-b border-amber-900/30 text-amber-200/90 text-[11px] sm:text-xs font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
        <span>
          <strong>LIVRAISON OFFERTE DÈS 60 €</strong> • CODE SNAPCHAT : <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">SNAP10</span> (-10%)
        </span>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Navigation Gauche */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300 font-medium">
          <Link href="/#collection" className="hover:text-amber-400 transition-colors">
            La Collection
          </Link>
          <Link href="/#bestsellers" className="hover:text-amber-400 transition-colors">
            Best-Sellers
          </Link>
          <Link href="/#avis" className="hover:text-amber-400 transition-colors">
            Avis Clients
          </Link>
          <Link href="/suivi" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-zinc-400">
            <Truck className="w-3.5 h-3.5" />
            Suivi Colis
          </Link>
        </nav>

        {/* Logo Central Prestige */}
        <Link href="/" className="text-center group flex flex-col items-center">
          <span className="font-serif tracking-[0.25em] text-lg sm:text-2xl font-light uppercase text-zinc-100 group-hover:text-amber-300 transition-colors">
            MAISON ÉLYSÉE
          </span>
          <span className="text-[9px] tracking-[0.35em] uppercase text-amber-400/90 font-medium -mt-0.5">
            HAUTE PARFUMERIE • PARIS
          </span>
        </Link>

        {/* Actions Droite (Suivi, Admin & Panier) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/admin"
            className="text-xs px-2.5 py-1.5 rounded-full border border-zinc-700 hover:border-amber-400/60 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 transition-all flex items-center gap-1.5"
            title="Espace Vendeur"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Espace Vendeur</span>
          </Link>

          <Link
            href="/suivi"
            className="md:hidden text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-800/60"
            title="Suivre mon colis"
          >
            <Truck className="w-5 h-5" />
          </Link>

          {/* Bouton Panier avec Badge */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2.5 rounded-full bg-zinc-900 border border-zinc-700/80 hover:border-amber-500/80 text-zinc-200 hover:text-amber-300 transition-all group flex items-center justify-center shadow-lg shadow-black/40"
            aria-label="Ouvrir le panier"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
