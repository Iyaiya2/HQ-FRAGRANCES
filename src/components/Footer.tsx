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
  MapPin,
  Mail,
} from 'lucide-react';

const FAQS = [
  {
    q: 'Pourquoi les parfums HQ Fragrance tiennent-ils plus de 24 heures ?',
    a: 'Nos créations sont formulées en Extrait de Parfum concentré à 30% d’huiles parfumées pures (contre 10% à 15% pour une eau de toilette classique), garantissant une tenue intense de plus de 24h sur la peau et plusieurs jours sur les vêtements.',
  },
  {
    q: 'Quels sont les délais et modes de livraison ?',
    a: 'Toute commande est expédiée sous 24h via Colissimo Domicile (48h) ou Mondial Relay Point Relais & Locker (3 à 5 jours) avec numéro de suivi.',
  },
  {
    q: 'Quels sont les moyens de paiement acceptés ?',
    a: 'Paiement 100% sécurisé via Stripe : Apple Pay, Google Pay, Carte Bancaire (Visa, Mastercard, CB) et paiement en 3x via Klarna.',
  },
];

export default function Footer() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <footer className="w-full">
      {/* Light FAQ Section above the black footer */}
      <div className="bg-white border-t border-zinc-200 text-zinc-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-2">
              Questions Fréquentes
            </p>
            <h3 className="font-serif text-3xl text-zinc-950 font-normal">
              Besoin d&apos;une information ?
            </h3>
          </div>

          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-semibold text-sm text-zinc-950">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-zinc-950' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-4 text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Black Luxury E-Commerce Footer */}
      <div className="bg-[#08080a] text-zinc-400 border-t border-zinc-800">
        {/* 4 Guarantees Bar */}
        <div className="border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Tenue 24h+</p>
                <p className="text-[11px] text-zinc-400">Extrait concentré à 30%</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Expédition 24/48h</p>
                <p className="text-[11px] text-zinc-400">Mondial Relay &amp; Colissimo</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Paiement Sécurisé</p>
                <p className="text-[11px] text-zinc-400">Stripe, Apple Pay &amp; CB</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">HQ Fragrance Paris</p>
                <p className="text-[11px] text-zinc-400">11 créations exclusives</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Store Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 border-b border-white/[0.08]">
          {/* Col 1: Brand & Logo */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo-white.png"
                alt="HQ Fragrance Paris"
                loading="lazy"
                width={120}
                height={82}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Maison de parfumerie dédiée aux extraits de parfum haute concentration (30%). Sillages intenses, matières premières sélectionnées et tenue longue durée.
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-white" /> Paris, France
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-white" /> Service Client 7j/7
              </span>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/#collection" className="hover:text-white transition-colors">
                  Les 11 Parfums Signatures
                </Link>
              </li>
              <li>
                <Link href="/#collection" className="hover:text-white transition-colors">
                  Vanillés &amp; Gourmands
                </Link>
              </li>
              <li>
                <Link href="/#collection" className="hover:text-white transition-colors">
                  Boisés &amp; Ambrés Intenses
                </Link>
              </li>
              <li>
                <Link href="/#collection" className="hover:text-white transition-colors">
                  Fruités &amp; Exotiques
                </Link>
              </li>
              <li>
                <Link href="/#collection" className="hover:text-white transition-colors">
                  Formats 50 ml &amp; 100 ml
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Informations & Suivi */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Service Client
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/suivi" className="hover:text-white transition-colors">
                  Suivre ma commande
                </Link>
              </li>
              <li>
                <Link href="/#savoir-faire" className="hover:text-white transition-colors">
                  Avis Clients Vérifiés
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3" />
                  <span>Espace Vendeur</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Paiement & Expédition */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Paiement &amp; Livraison
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Transactions chiffrées SSL 256-bit via Stripe Checkout et expédition suivie partout en France, Belgique et Suisse.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'Apple Pay',
                'Google Pay',
                'Visa',
                'Mastercard',
                'CB',
                'Klarna 3x',
                'Mondial Relay',
                'Colissimo 48h',
              ].map(badge => (
                <span
                  key={badge}
                  className="text-[10px] px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/10 text-zinc-200 font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 HQ Fragrance Paris. Tous droits réservés.</p>
          <p className="text-zinc-400">
            Haute Parfumerie • Concentration Extrait 30%
          </p>
        </div>
      </div>
    </footer>
  );
}
