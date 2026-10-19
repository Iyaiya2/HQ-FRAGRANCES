'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  Clock,
  Lock,
  ChevronDown,
  Award,
} from 'lucide-react';

const FAQS = [
  {
    q: 'Pourquoi les parfums HQ Fragrance tiennent-ils plus de 24 heures ?',
    a: 'Nos créations sont formulées en Extrait de Parfum concentré à 30% d’huiles parfumées pures (contre 10% à 15% pour une eau de toilette classique), garantissant une tenue intense de plus de 24h sur la peau et plusieurs jours sur les vêtements.',
  },
  {
    q: 'Quels sont les délais et modes de livraison ?',
    a: 'Toute commande est expédiée sous 24h via Colissimo Domicile (48h) ou Mondial Relay Point Relais & Locker (3 à 5 jours).',
  },
  {
    q: 'Quels sont les moyens de paiement acceptés ?',
    a: 'Paiement 100% sécurisé via Stripe : Apple Pay, Google Pay, Carte Bancaire (Visa, Mastercard, CB) et paiement en 3x via Klarna.',
  },
];

export default function Footer() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <footer className="bg-[#060608] border-t border-white/[0.08] text-zinc-400 text-xs">
      {/* Simple FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 border-b border-white/[0.06]">
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d5b8] mb-2">
            Questions Fréquentes
          </p>
          <h3 className="font-serif text-3xl text-white font-normal">
            Besoin d&apos;une information ?
          </h3>
        </div>

        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-medium text-sm text-white">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="pb-4 text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Clean Guarantees */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#e6d5b8] shrink-0" />
            <div>
              <p className="text-xs font-medium text-white">Tenue 24h+</p>
              <p className="text-[11px] text-zinc-500">Extrait concentré à 30%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#e6d5b8] shrink-0" />
            <div>
              <p className="text-xs font-medium text-white">Expédition 24/48h</p>
              <p className="text-[11px] text-zinc-500">Mondial Relay &amp; Colissimo</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#e6d5b8] shrink-0" />
            <div>
              <p className="text-xs font-medium text-white">Paiement Sécurisé</p>
              <p className="text-[11px] text-zinc-500">Apple Pay, CB &amp; Klarna</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-[#e6d5b8] shrink-0" />
            <div>
              <p className="text-xs font-medium text-white">HQ Fragrance Paris</p>
              <p className="text-[11px] text-zinc-500">11 créations signatures</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo-white.png"
            alt="HQ Fragrance Paris"
            loading="lazy"
            width={90}
            height={62}
            className="h-8 w-auto object-contain opacity-90"
          />
          <span className="text-xs text-zinc-500">
            © 2026 HQ Fragrance Paris. Tous droits réservés.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
          <Link href="/#collection" className="hover:text-white transition-colors">
            Parfums
          </Link>
          <Link href="/suivi" className="hover:text-white transition-colors">
            Suivi Colis
          </Link>
          <Link
            href="/admin"
            className="hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            <span>Vendeur</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
