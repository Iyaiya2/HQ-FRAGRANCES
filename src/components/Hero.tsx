'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Truck, Clock, Award, ArrowRight, Flame } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-16 sm:pb-20 border-b border-zinc-800/60">
      {/* Halo ambré et doré de fond */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[850px] h-[300px] sm:h-[400px] bg-gradient-to-b from-amber-600/15 via-amber-700/5 to-transparent blur-3xl pointer-events-none rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge Homme & Haute Puissance */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/40 text-amber-300 text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-5 shadow-lg shadow-amber-950/20">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>HQ FRAGRANCE • 100% POUR HOMME • EXTRAIT 30%</span>
          </div>

          {/* Titre Principal Masculin & Impactant */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight mb-5">
            La puissance d&apos;un sillage <br className="hidden sm:inline" />
            <span className="font-normal italic gold-gradient-text">viril &amp; inoubliable.</span>
          </h1>

          {/* Descriptif */}
          <p className="text-sm sm:text-base text-zinc-300/90 font-light leading-relaxed mb-8 max-w-xl mx-auto">
            Découvrez nos <strong>11 extraits de parfum masculins</strong> formulés avec une concentration record de 30% d&apos;huiles pures. Une tenue extrême de plus de 24h sur peau et vêtements.
          </p>

          {/* Boutons d'Action (Mobile First) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
            <a
              href="#collection"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Découvrir les 11 créations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#bestsellers"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-medium text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2"
            >
              <span>Voir les Best-Sellers</span>
            </a>
          </div>

          {/* 4 Piliers Réassurance */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-6 border-t border-zinc-800/80">
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-100">Tenue 24h+</p>
                <p className="text-[10px] sm:text-[11px] text-zinc-400">Extrait pur 30%</p>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-100">Envoi 24/48h</p>
                <p className="text-[10px] sm:text-[11px] text-zinc-400">Mondial Relay &amp; Colissimo</p>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-100">100% Sécurisé</p>
                <p className="text-[10px] sm:text-[11px] text-zinc-400">Apple Pay &amp; Stripe</p>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-100">100% Homme</p>
                <p className="text-[10px] sm:text-[11px] text-zinc-400">Sillages virils affirmés</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
