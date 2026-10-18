'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Truck, Clock, Award, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-zinc-800/60">
      {/* Halo lumineux ambré de fond */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] sm:h-[450px] bg-gradient-to-b from-amber-600/15 via-amber-500/5 to-transparent blur-3xl pointer-events-none rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge Haute Concentration */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-6 shadow-lg shadow-amber-950/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Extraits Purs • 30% de Concentration</span>
          </div>

          {/* Titre Principal */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight sm:leading-none mb-6">
            L&apos;art du sillage <br className="hidden sm:inline" />
            <span className="font-normal italic gold-gradient-text">inoubliable &amp; magnétique.</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-sm sm:text-lg text-zinc-300/90 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
            Découvrez nos créations exclusives et nos réinterprétations d&apos;exception. Des fragrances intenses et envoûtantes formulées pour tenir plus de 24h sur peau et textiles.
          </p>

          {/* Boutons d'Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-12">
            <a
              href="#collection"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Découvrir la collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#bestsellers"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-500 text-zinc-200 hover:text-white font-medium text-sm tracking-wide transition-all flex items-center justify-center gap-2"
            >
              <span>Voir les 3 Best-Sellers</span>
            </a>
          </div>

          {/* Grille de Réassurance (4 piliers) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-zinc-800/80">
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-100">Tenue 24h+</p>
                <p className="text-[11px] text-zinc-400">Extrait pur 30%</p>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-100">Envoi 24/48h</p>
                <p className="text-[11px] text-zinc-400">Mondial Relay &amp; Colissimo</p>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-100">100% Sécurisé</p>
                <p className="text-[11px] text-zinc-400">Apple Pay &amp; CB Stripe</p>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-100">Échantillon Offert</p>
                <p className="text-[11px] text-zinc-400">Dans chaque colis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
