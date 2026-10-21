'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Truck,
  Lock,
  Menu,
  X,
} from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export default function Navbar() {
  const { totalItemsCount, subtotal, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#08080a]/90 border-b border-white/[0.08]">
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Links */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-8 flex-1">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-1 rounded-lg text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <nav className="hidden lg:flex items-center gap-4 xl:gap-7 text-[11px] xl:text-xs font-medium tracking-[0.08em] xl:tracking-[0.14em] uppercase text-zinc-300">
            <Link
              href="/#collection"
              className="whitespace-nowrap hover:text-white transition-colors"
            >
              Les 11 Parfums
            </Link>
            <Link
              href="/#savoir-faire"
              className="whitespace-nowrap hover:text-white transition-colors"
            >
              Avis Clients
            </Link>
            <Link
              href="/suivi"
              className="whitespace-nowrap hover:text-white transition-colors"
            >
              Suivi Colis
            </Link>
          </nav>
        </div>

        {/* Center Logo */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center shrink-0 group"
        >
          <img
            src="/images/logo-white.png"
            alt="HQ Fragrance Paris"
            width={110}
            height={76}
            className="h-9 sm:h-11 w-auto object-contain opacity-95 group-hover:opacity-100 transition-opacity"
          />
        </Link>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-3 flex-1">
          <Link
            href="/suivi"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white transition-colors"
          >
            <Truck className="w-4 h-4 text-zinc-400" />
            <span>Suivi</span>
          </Link>

          <Link
            href="/admin"
            className="p-2 rounded-lg text-zinc-400 hover:text-white transition-colors"
            title="Espace Vendeur"
          >
            <Lock className="w-4 h-4" />
          </Link>

          {/* Clean Cart Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm"
            aria-label="Ouvrir le panier"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Panier</span>
            {totalItemsCount > 0 && (
              <span className="bg-zinc-950 text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {totalItemsCount}
              </span>
            )}
            {subtotal > 0 && (
              <span className="hidden md:inline font-mono text-[0.7rem] text-zinc-700 border-l border-zinc-300 pl-2">
                {subtotal.toFixed(0)} €
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Simple Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#0c0c10] px-4 py-4 space-y-2">
          <Link
            href="/#collection"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm font-medium text-white"
          >
            Les 11 Parfums
          </Link>
          <Link
            href="/#savoir-faire"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm font-medium text-white"
          >
            Avis Clients
          </Link>
          <Link
            href="/suivi"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm font-medium text-white"
          >
            Suivre ma commande
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-lg hover:bg-white/5 text-xs text-zinc-400"
          >
            Espace Vendeur
          </Link>
        </div>
      )}
    </header>
  );
}
