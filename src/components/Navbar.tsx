'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, ShieldCheck, Truck, Lock } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export default function Navbar() {
  const { totalItemsCount, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#08080a]/90 border-b border-zinc-800/80 transition-all">
      {/* Top Bar Promotionnelle */}
      <div className="bg-gradient-to-r from-zinc-950 via-amber-950/70 to-zinc-950 border-b border-amber-500/20 text-amber-200 text-[11px] sm:text-xs font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
        <span>
          <strong>LIVRAISON OFFERTE DÈS 60 €</strong> • CODE SNAPCHAT : <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">SNAP10</span> (-10%)
        </span>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Navigation Gauche */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm text-zinc-300 font-medium">
          <Link href="/#collection" className="hover:text-amber-400 transition-colors uppercase tracking-wider text-xs">
            Les 11 Parfums
          </Link>
          <Link href="/#bestsellers" className="hover:text-amber-400 transition-colors uppercase tracking-wider text-xs">
            Best-Sellers
          </Link>
          <Link href="/#avis" className="hover:text-amber-400 transition-colors uppercase tracking-wider text-xs">
            Avis Clients
          </Link>
          <Link href="/suivi" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-zinc-400 uppercase tracking-wider text-xs">
            <Truck className="w-3.5 h-3.5" />
            Suivi Colis
          </Link>
        </nav>

        {/* Logo Central HQ FRAGRANCE */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-zinc-950 border border-amber-500/40 p-1 flex items-center justify-center shadow-lg shadow-amber-950/40 group-hover:border-amber-400 transition-colors">
            <img
              src="/images/logo.png"
              alt="HQ Fragrance Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif tracking-[0.2em] text-lg sm:text-xl font-bold uppercase text-white group-hover:text-amber-300 transition-colors">
              HQ FRAGRANCE
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-amber-400/90 font-semibold -mt-0.5">
              EXTRAIT DE PARFUM POUR HOMME
            </span>
          </div>
        </Link>

        {/* Actions Droite */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/admin"
            className="text-xs px-2.5 py-1.5 rounded-full border border-zinc-800 hover:border-amber-400/60 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 transition-all flex items-center gap-1.5"
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

          {/* Bouton Panier */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-amber-500/80 text-zinc-200 hover:text-amber-300 transition-all group flex items-center justify-center shadow-lg shadow-black/40"
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
