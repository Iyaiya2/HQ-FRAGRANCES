'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Sparkles, Lock, Clock, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-xs">
      {/* FAQ Express */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-zinc-900">
        <h3 className="font-serif text-xl sm:text-2xl text-white text-center mb-8">
          Questions Fréquentes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5">
            <h4 className="font-bold text-sm text-zinc-100 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Quelle est la tenue des parfums ?
            </h4>
            <p className="text-zinc-400 leading-relaxed font-light">
              Tous nos flacons sont dosés à <strong>30% de concentration</strong> (Extraits de Parfum purs). Le sillage persiste plus de 24 heures sur peau et plusieurs jours sur vos vêtements.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5">
            <h4 className="font-bold text-sm text-zinc-100 mb-2 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              Quels sont les délais de livraison ?
            </h4>
            <p className="text-zinc-400 leading-relaxed font-light">
              Chaque commande est préparée sous 24h ouvrées. Vous êtes livré en <strong>48h avec Colissimo</strong> ou en <strong>3 à 5 jours via Mondial Relay</strong> avec un lien de suivi en direct.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5">
            <h4 className="font-bold text-sm text-zinc-100 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Le paiement est-il sécurisé ?
            </h4>
            <p className="text-zinc-400 leading-relaxed font-light">
              Paiement 100% sécurisé via l’infrastructure Stripe. Validation 3D Secure, Apple Pay et Google Pay. Aucune coordonnée bancaire n&apos;est stockée sur nos serveurs.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <Link href="/" className="font-serif tracking-[0.25em] text-lg text-white font-light uppercase">
            MAISON ÉLYSÉE
          </Link>
          <p className="text-[11px] text-zinc-500 mt-1">
            Haute Parfumerie &amp; Extraits Purs de Grasse • Paris
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-400">
          <Link href="/#collection" className="hover:text-amber-400 transition-colors">
            La Collection
          </Link>
          <Link href="/suivi" className="hover:text-amber-400 transition-colors">
            Suivi de Commande
          </Link>
          <Link href="/admin" className="hover:text-amber-400 transition-colors flex items-center gap-1 text-zinc-500 hover:text-zinc-300">
            <Lock className="w-3 h-3 text-amber-500" />
            Accès Vendeur
          </Link>
        </div>

        <div className="text-[11px] text-zinc-500 text-center md:text-right">
          © 2026 Maison Élysée. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
