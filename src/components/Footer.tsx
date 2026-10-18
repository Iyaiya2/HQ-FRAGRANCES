'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Clock, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-xs">
      {/* FAQ Express */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-zinc-900">
        <h3 className="font-serif text-xl sm:text-2xl text-white text-center mb-8">
          Questions Fréquentes • HQ Fragrance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5">
            <h4 className="font-bold text-sm text-zinc-100 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Quelle est la tenue sur peau et vêtements ?
            </h4>
            <p className="text-zinc-400 leading-relaxed font-light">
              Toutes les créations HQ Fragrance sont formulées avec une <strong>concentration de 30% d&apos;extraits purs</strong>. Le sillage persiste plus de 24 heures sur peau et plusieurs jours sur vos textiles (veste, hoodie, chemise).
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5">
            <h4 className="font-bold text-sm text-zinc-100 mb-2 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              Comment se passe la livraison ?
            </h4>
            <p className="text-zinc-400 leading-relaxed font-light">
              Votre commande est emballée sous protection antichoc sous 24h. Livraison en <strong>48h Colissimo à domicile</strong> ou en <strong>3-5 jours en Locker / Point Relais Mondial Relay</strong> avec lien de suivi SMS et email.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5">
            <h4 className="font-bold text-sm text-zinc-100 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Le paiement est-il 100% sécurisé ?
            </h4>
            <p className="text-zinc-400 leading-relaxed font-light">
              Paiement direct et chiffré via l’infrastructure Stripe. Protection anti-fraude Stripe Radar, 3D Secure, Apple Pay, Google Pay et Klarna (3x/4x). Aucune donnée bancaire n&apos;est stockée sur le site.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-amber-500/40 p-1 flex items-center justify-center">
            <img src="/images/logo.png" alt="HQ Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-left">
            <span className="font-serif tracking-[0.2em] text-base text-white font-bold uppercase block">
              HQ FRAGRANCE
            </span>
            <p className="text-[10px] text-zinc-400">
              Extraits de Parfum pour Homme • Concentration 30%
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-400">
          <Link href="/#collection" className="hover:text-amber-400 transition-colors uppercase tracking-wider text-xs">
            Les 11 Parfums
          </Link>
          <Link href="/suivi" className="hover:text-amber-400 transition-colors uppercase tracking-wider text-xs">
            Suivi Colis
          </Link>
          <Link href="/admin" className="hover:text-amber-400 transition-colors flex items-center gap-1 text-zinc-400 hover:text-white uppercase tracking-wider text-xs">
            <Lock className="w-3 h-3 text-amber-500" />
            Espace Vendeur
          </Link>
        </div>

        <div className="text-[11px] text-zinc-400 text-center md:text-right">
          © 2026 HQ Fragrance. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
